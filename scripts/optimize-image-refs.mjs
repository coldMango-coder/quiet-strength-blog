#!/usr/bin/env node
// Lightweight reference updater for images without external deps
// - Scans public/images for existing .avif/.webp
// - Rewrites references in src/* and selected public files to use smaller formats
// - Adds loading="lazy" and decoding="async" to <img> without those attributes

import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');
const publicImagesRoot = path.join(repoRoot, 'public', 'images');
const TARGET_BYTES = 300 * 1024; // keep in sync with optimize-images.mjs
const VERSION = process.env.IMG_VERSION || process.env.VERCEL_GIT_COMMIT_SHA || String(Date.now());

function walkSync(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkSync(full, files); else files.push(full);
  }
  return files;
}

async function buildExistingFormatsMap() {
  const files = walkSync(publicImagesRoot).filter(f => /\.(webp|avif)$/i.test(f));
  const map = new Map();
  for (const abs of files) {
    try {
      const st = fs.statSync(abs);
      const rel = '/' + path.relative(path.join(repoRoot, 'public'), abs).replace(/\\/g, '/');
      map.set(rel, { size: st.size });
    } catch {}
  }
  return map;
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
    if (hasAvif && typeof avifSize === 'number' && avifSize <= TARGET_BYTES && (!hasWebp || (webpSize && webpSize > TARGET_BYTES))) {
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
    return p1 + appendVersion(p2 + '.webp') + p3;
  });
  return out;
}

async function updateReferences(existingFormats) {
  const all = walkSync(repoRoot).filter(f => {
    const rel = path.relative(repoRoot, f).replace(/\\/g, '/');
    if (/node_modules\//.test(rel) || /\.vercel\//.test(rel) || /build\//.test(rel) || /dist\//.test(rel)) return false;
    return /(src\/.*\.(js|jsx|ts|tsx|html|css))$/.test(rel) || /public\/.*\.md$/.test(rel) || rel === 'public/index.html';
  });

  let changed = 0;
  for (const abs of all) {
    try {
      const orig = await fsp.readFile(abs, 'utf8');
      let next = orig;
      next = replaceImageExtensions(next, existingFormats);
      if (/<img\b/i.test(next)) {
        next = next.replace(/<img\b([^>]*?)\/>|<img\b([^>]*?)>/g, (m) => {
          if (/loading\s*=/.test(m)) return m;
          return m.replace(/<img\b/, '<img loading="lazy" decoding="async"');
        });
      }
      if (next !== orig) {
        await fsp.writeFile(abs, next, 'utf8');
        changed++;
        console.log('Updated refs in', path.relative(repoRoot, abs));
      }
    } catch {}
  }
  console.log(`Reference updates applied in ${changed} files`);
}

(async () => {
  const fm = await buildExistingFormatsMap();
  await updateReferences(fm);
})();
