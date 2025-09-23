import { globby } from 'globby';
import { dirname, extname, join, relative, resolve } from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import fs from 'fs/promises';
import fssync from 'fs';

/**
 * Optimize all images and update references across the codebase.
 * - Converts JPG/PNG to AVIF/WebP under a target size (~300KB)
 * - Updates references in Markdown/JSX/HTML to .webp when present
 * - Adds loading="lazy" and decoding="async" to <img> tags lacking them
 * - Skips build artifacts (.vercel, node_modules, lighthouse reports)
 *
 * Usage:
 *   npm run optimize-images              # dry-run (shows planned changes)
 *   WRITE=1 npm run optimize-images      # applies changes
 */

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');
const publicImagesRoot = resolve(repoRoot, 'public', 'images');
const srcImagesRoot = resolve(repoRoot, 'src', 'images');

const WRITE = process.env.WRITE === '1' || process.argv.includes('--write');
const TARGET_BYTES = 300 * 1024; // 300KB target

async function ensureDir(p) {
  await fs.mkdir(dirname(p), { recursive: true });
}

async function statOrNull(p) {
  try { return await fs.stat(p); } catch { return null; }
}

async function compressBinarySearch(inputPath, outPath, format) {
  // Binary search quality to hit target size without obvious visual loss
  let lo = format === 'avif' ? 28 : 50; // conservative lower bound
  let hi = format === 'avif' ? 60 : 85; // conservative upper bound
  let best = null;

  for (let i = 0; i < 6; i++) { // 6 iterations is enough (2^6 ~ 64)
    const q = Math.round((lo + hi) / 2);
    try {
      const pipeline = sharp(inputPath);
      if (format === 'avif') {
        await pipeline
          .avif({ quality: q, effort: 4 })
          .toFile(outPath);
      } else if (format === 'webp') {
        await pipeline
          .webp({ quality: q })
          .toFile(outPath);
      } else {
        throw new Error('Unsupported format ' + format);
      }
      const st = await fs.stat(outPath);
      const within = st.size <= TARGET_BYTES;
      best = { q, size: st.size };
      if (within) {
        // try increasing quality if still under target
        lo = q + 1;
      } else {
        hi = q - 1;
      }
      if (hi < lo) break;
    } catch (e) {
      // If sharp fails at this quality (rare), tighten bounds downward
      hi = q - 1;
    }
  }

  // If we overshot and last saved is over target, try with lo bound
  let st = await fs.stat(outPath).catch(() => null);
  if (!st || st.size > TARGET_BYTES) {
    // Try progressively lower qualities until under target or min reached
    const sequence = format === 'avif'
      ? [50, 45, 42, 40, 38, 35, 32, 30, 28, 26, 24, 22]
      : [60, 55, 52, 50, 48, 45, 42, 40, 38, 35, 32, 30, 28, 26, 24];
    for (const q of sequence) {
      const pipeline = sharp(inputPath);
      await (format === 'avif'
        ? pipeline.avif({ quality: q, effort: 4 }).toFile(outPath)
        : pipeline.webp({ quality: q }).toFile(outPath));
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

  const originalStat = await statOrNull(inputPath);
  if (!originalStat) return null;

  const results = { inputPath, outAvif: null, outWebp: null };

  try {
    await ensureDir(outAvif);
    const existingA = await statOrNull(outAvif);
    if (!existingA || existingA.size > TARGET_BYTES) {
      await compressBinarySearch(inputPath, outAvif, 'avif');
    }
    const stA = await statOrNull(outAvif);
    if (stA) results.outAvif = { path: outAvif, size: stA.size };
  } catch (e) {
    // continue with webp even if avif fails
  }

  try {
    await ensureDir(outWebp);
    const existingW = await statOrNull(outWebp);
    if (!existingW || existingW.size > TARGET_BYTES) {
      await compressBinarySearch(inputPath, outWebp, 'webp');
    }
    const stW = await statOrNull(outWebp);
    if (stW) results.outWebp = { path: outWebp, size: stW.size };
  } catch (e) {
    // noop
  }

  return results;
}

function createWebpPathIfExists(pathStr) {
  const ext = extname(pathStr).toLowerCase();
  if (!['.jpg', '.jpeg', '.png'].includes(ext)) return null;
  const webp = pathStr.slice(0, -ext.length) + '.webp';
  const abs = join(publicImagesRoot, relative('/images', webp.startsWith('/images') ? webp : ('/images/' + webp)));
  if (fssync.existsSync(abs)) return webp;
  return null;
}

function addLazyLoadingToImgTags(content) {
  // Adds loading and decoding if missing in <img ...> (JSX/HTML)
  return content.replace(/<img\b([^>]*?)\/>|<img\b([^>]*?)>/g, (m) => {
    if (/loading\s*=/.test(m)) return m; // already has loading
    let updated = m.replace(/<img\b/, '<img loading="lazy" decoding="async"');
    return updated;
  });
}

function replaceImageExtensions(content, existingFormats) {
  // Replace /images/foo.(png|jpg|jpeg) with .avif or .webp depending on availability and size
  let out = content.replace(/(["'\(])((?:\/)?images\/[^"'\)]+?)\.(png|jpg|jpeg)(["'\)])(?!\.)/gi, (match, p1, p2, _ext, p4) => {
    const base = p2.startsWith('/') ? p2 : '/' + p2;
    const webpKey = base + '.webp';
    const avifKey = base + '.avif';
    const hasWebp = !!existingFormats.get(webpKey);
    const hasAvif = !!existingFormats.get(avifKey);
    const webpSize = existingFormats.get(webpKey)?.size;
    const avifSize = existingFormats.get(avifKey)?.size;

    // Prefer AVIF if <= target and either webp missing or > target
    if (hasAvif && avifSize <= TARGET_BYTES && (!hasWebp || (webpSize && webpSize > TARGET_BYTES))) {
      return p1 + p2 + '.avif' + p4;
    }
    if (hasWebp) {
      return p1 + p2 + '.webp' + p4;
    }
    return match;
  });
  // Also prefer AVIF over existing WebP references when AVIF is comfortably under target and WebP is not
  out = out.replace(/(["'\(])((?:\/)?images\/[^"'\)]+?)\.webp(["'\)])(?!\.)/gi, (match, p1, p2, p3) => {
    const base = p2.startsWith('/') ? p2 : '/' + p2;
    const webpKey = base + '.webp';
    const avifKey = base + '.avif';
    const webpSize = existingFormats.get(webpKey)?.size;
    const avifSize = existingFormats.get(avifKey)?.size;
    if (typeof webpSize === 'number' && typeof avifSize === 'number' && avifSize <= TARGET_BYTES && webpSize > TARGET_BYTES) {
      return p1 + p2 + '.avif' + p3;
    }
    return match;
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
  const targets = await globby(
    [
      'src/**/*.{js,jsx,ts,tsx,html,css}',
      'public/**/*.md',
      'public/index.html',
    ],
    {
      cwd: repoRoot,
      ignore: [
        '**/node_modules/**',
        '**/.vercel/**',
        '**/playwright-report/**',
        '**/lighthouse-*.json',
        '**/build/**',
        '**/dist/**',
      ],
      absolute: true,
    },
  );

  const changes = [];
  for (const absPath of targets) {
    const orig = await fs.readFile(absPath, 'utf8');
    let next = orig;

    // Frontmatter fields: image/ogImage/twitterImage in Markdown
    if (/\.mdx?$/.test(absPath) || /public\/.+\.html$/.test(absPath) || /src\//.test(absPath)) {
      next = replaceImageExtensions(next, existingFormats);
    }

    // Add lazy loading to <img> tags
    if (/<img\b/i.test(next)) {
      next = addLazyLoadingToImgTags(next);
    }

    if (next !== orig) {
      changes.push({ file: absPath, bytes: Buffer.byteLength(next, 'utf8') - Buffer.byteLength(orig, 'utf8') });
      if (WRITE) {
        await fs.writeFile(absPath, next, 'utf8');
      }
    }
  }

  return changes;
}

async function run() {
  // 1) Find all candidate images in public/images and src/images
  const imageFiles = await globby(
    [
      'public/images/**/*.{jpg,jpeg,png}',
      'src/images/**/*.{jpg,jpeg,png}',
    ],
    { cwd: repoRoot, absolute: true }
  );

  if (!imageFiles.length) {
    console.log('No raster images found under public/images or src/images');
  } else {
    console.log(`Found ${imageFiles.length} images to process${WRITE ? '' : ' (dry-run: skipping compression)'}`);
  }

  const results = [];
  if (WRITE) {
    for (const img of imageFiles) {
      const r = await optimizeOne(img);
      if (r) results.push(r);
    }
  }

  // Build set of existing .webp to support safe reference replacement
  const existingFormats = await buildExistingFormatsMap();

  // 2) Update references across codebase
  const changes = await updateReferences(existingFormats);

  // Report
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

  if (changes.length) {
    console.log(`\nReference updates in ${changes.length} files${WRITE ? ' (applied)' : ' (dry-run)'}`);
    for (const c of changes) {
      console.log(' -', relative(repoRoot, c.file));
    }
  } else {
    console.log('\nNo reference updates were necessary.');
  }

  if (!WRITE) {
    console.log('\nDry-run complete. To apply changes, run with WRITE=1 env or --write:\n  WRITE=1 npm run optimize-images\n  # or\n  node scripts/optimize-images.mjs --write');
  }
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
