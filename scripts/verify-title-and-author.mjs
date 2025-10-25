import fs from 'node:fs';
import path from 'node:path';

// Fix check: verify About title contains correct diacritic and no mojibake appears
const PAGES = [
  'build/about/index.html',
  'build/index.html',
];

const MUST_CONTAIN = [
  /<title>[^<]*Marica\s+Šinko[^<]*<\/title>/i,
];

const BAD_PATTERNS = [
  /Marica\s+[���\?]/i,
  /Marica\s+[�,�A�]/i,
  /Marica\s+Sinko/i,
];

let failed = false;
for (const rel of PAGES) {
  const p = path.resolve(rel);
  if (!fs.existsSync(p)) { console.warn('WARN missing', rel); continue; }
  const html = fs.readFileSync(p, 'utf8');
  for (const rx of MUST_CONTAIN) {
    if (!rx.test(html)) {
      console.error(`FAIL: ${rel} does not contain expected diacritic string in <title>.`);
      failed = true;
    }
  }
  for (const bad of BAD_PATTERNS) {
    if (bad.test(html)) {
      console.error(`FAIL: ${rel} still contains mojibake or bad chars near author name.`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('verify-title-and-author: OK — correct Šinko in <title>, no mojibake found.');

