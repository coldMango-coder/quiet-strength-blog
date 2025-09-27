import { globby } from 'globby';
import { dirname, extname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs/promises';
import fssync from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const publicImagesRoot = resolve(repoRoot, 'public', 'images');
const srcImagesRoot = resolve(repoRoot, 'src', 'images');

const WRITE = process.env.WRITE === '1' || process.argv.includes('--write');
const REFS_ONLY = process.argv.includes('--refs-only');
const TARGET_BYTES = 300 * 1024; // 300KB
const VERSION = process.env.IMG_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());

async function ensureDir(p) { await fs.mkdir(dirname(p), { recursive: true }); }
async function statOrNull(p) { try { return await fs.stat(p); } catch { return null; } }

async function compressBinarySearch(inputPath, outPath, format) {
  let lo = format === 'avif' ? 28 : 50;
  let hi = format === 'avif' ? 60 : 85;
  for (let i = 0; i < 6; i++) {
    const q = Math.round((lo + hi) / 2);
    try {
      const pipeline = sharp(inputPath);
      if (format === 'avif') await pipeline.avif({ quality: q, effort: 4 }).toFile(outPath);
      else await pipeline.webp({ quality: q }).toFile(outPath);
      const st = await fs.stat(outPath);
      if (st.size <= TARGET_BYTES) lo = q + 1; else hi = q - 1;
      if (hi < lo) break;
    } catch {
      hi = q - 1;
    }
  }
  let st = await fs.stat(outPath).catch(() => null);
  if (!st || st.size > TARGET_BYTES) {
    const seq = format === 'avif' ? [50,45,42,40,38,35,32,30,28,26,24,22] : [60,55,52,50,48,45,42,40,38,35,32,30,28,26,24];
    for (const q of seq) {
      const pipeline = sharp(inputPath);
      if (format === 'avif') await pipeline.avif({ quality: q, effort: 4 }).toFile(outPath);
      else await pipeline.webp({ quality: q }).toFile(outPath);
      st = await fs.stat(outPath).catch(() => null);
      if (st && st.size <= TARGET_BYTES) break;
    }
  }
}

async function optimizeOne(inputPath) {
  const ext = extname(inputPath).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;
  const base = inputPath.slice(0, -ext.length);
  const outAvif = base + '.avif';
  const outWebp = base + '.webp';
  const results = { inputPath, outAvif: null, outWebp: null };
  const stIn = await statOrNull(inputPath); if (!stIn) return null;
  try {
    await ensureDir(outAvif);
    const existingA = await statOrNull(outAvif);
    if (!existingA || existingA.size > TARGET_BYTES) await compressBinarySearch(inputPath, outAvif, 'avif');
    const stA = await statOrNull(outAvif); if (stA) results.outAvif = { path: outAvif, size: stA.size };
  } catch {}
  try {
    await ensureDir(outWebp);
    const existingW = await statOrNull(outWebp);
    if (!existingW || existingW.size > TARGET_BYTES) await compressBinarySearch(inputPath, outWebp, 'webp');
    const stW = await statOrNull(outWebp); if (stW) results.outWebp = { path: outWebp, size: stW.size };
  } catch {}
  return results;
}

function appendVersion(url) { return url.includes('?') ? `${url}&v=${VERSION}` : `${url}?v=${VERSION}`; }

function replaceImageExtensions(content, existingFormats) {
  let out = content.replace(/(["'\(])((?:\/)?images\/[^"'\)]+?)\.(png|jpg|jpeg)(["'\)])(?!\.)/gi, (match, p1, p2, _ext, p4) => {
    const base = p2.startsWith('/') ? p2 : '/' + p2;
    const webpKey = base + '.webp';
    const avifKey = base + '.avif';
    const hasWebp = existingFormats.has(webpKey);
    const hasAvif = existingFormats.has(avifKey);
    const webpSize = existingFormats.get(webpKey)?.size;
    const avifSize = existingFormats.get(avifKey)?.size;
    if (hasAvif && avifSize <= TARGET_BYTES && (!hasWebp || (webpSize && webpSize > TARGET_BYTES))) {
      return p1 + appendVersion(p2 + '.avif') + p4;
    }
    if (hasWebp) {
      return p1 + appendVersion(p2 + '.webp') + p4;
    }
    return match;
  });
  out = out.replace(/(["'\(])((?:\/)?images\/[^"'\)]+?)\.webp(["'\)])(?!\.)/gi, (match, p1, p2, p3) => {
    const base = p2.startsWith('/') ? p2 : '/' + p2;
    const webpKey = base + '.webp';
    const avifKey = base + '.avif';
    const webpSize = existingFormats.get(webpKey)?.size;
    const avifSize = existingFormats.get(avifKey)?.size;
    if (typeof webpSize === 'number' && typeof avifSize === 'number' && avifSize <= TARGET_BYTES && webpSize > TARGET_BYTES) {
      return p1 + appendVersion(p2 + '.avif') + p3;
    }
    // Even if staying on webp, bust cache
    return p1 + appendVersion(p2 + '.webp') + p3;
  });
  return out;
}

async function buildExistingFormatsMap() {
  const files = await globby(['public/images/**/*.{webp,avif}'], { cwd: repoRoot, absolute: false });
  const map = new Map();
  for (const f of files) {
    const abs = resolve(repoRoot, f);
    const st = await fs.stat(abs).catch(() => null);
    if (!st) continue;
    const key = '/' + f.replace(/^public\//, '');
    map.set(key, { size: st.size });
  }
  return map;
}

async function updateReferences(existingFormats) {
  const targets = await globby([
    'src/**/*.{js,jsx,ts,tsx,html,css}',
    'public/**/*.md',
    'public/index.html',
  ], { cwd: repoRoot, ignore: ['**/node_modules/**','**/.vercel/**','**/build/**','**/dist/**'], absolute: true });

  const changes = [];
  for (const absPath of targets) {
    const orig = await fs.readFile(absPath, 'utf8');
    let next = orig;
    if (/\.mdx?$/.test(absPath) || /public\/.+\.html$/.test(absPath) || /src\//.test(absPath)) {
      next = replaceImageExtensions(next, existingFormats);
    }
    if (/<img\b/i.test(next)) {
      next = next.replace(/<img\b([^>]*?)\/>|<img\b([^>]*?)>/g, (m) => {
        if (/loading\s*=/.test(m)) return m;
        return m.replace(/<img\b/, '<img loading="lazy" decoding="async"');
      });
    }
    if (next !== orig) {
      changes.push({ file: absPath });
      if (WRITE) await fs.writeFile(absPath, next, 'utf8');
    }
  }
  return changes;
}

async function run() {
  const imageFiles = await globby(['public/images/**/*.{jpg,jpeg,png}','src/images/**/*.{jpg,jpeg,png}'], { cwd: repoRoot, absolute: true });
  console.log(`Found ${imageFiles.length} images to process${WRITE ? '' : ' (dry-run: skipping compression)'}${REFS_ONLY ? ' [refs-only]' : ''}`);
  const results = [];
  if (WRITE && !REFS_ONLY) {
    for (const img of imageFiles) {
      const r = await optimizeOne(img);
      if (r) results.push(r);
    }
  } else if (WRITE && REFS_ONLY) {
    console.log('Skipping binary compression (refs-only mode)');
  }
  const existingFormats = await buildExistingFormatsMap();
  const changes = await updateReferences(existingFormats);
  if (WRITE) {
    console.log('\nImage optimization summary:');
    for (const r of results) {
      const rel = relative(repoRoot, r.inputPath);
      const parts = [];
      if (r.outAvif) parts.push(`AVIF=${Math.round(r.outAvif.size/1024)}KB`);
      if (r.outWebp) parts.push(`WebP=${Math.round(r.outWebp.size/1024)}KB`);
      console.log(` - ${rel} => ${parts.join(', ')}`);
    }
  }
  console.log(`\nReference updates in ${changes.length} files${WRITE ? ' (applied)' : ' (dry-run)'}`);
  for (const c of changes) console.log(' -', relative(repoRoot, c.file));
  if (!WRITE) console.log('\nDry-run complete. To apply changes, run with WRITE=1 env or --write');
}

run().catch((e)=>{ console.error(e); process.exit(1); });

