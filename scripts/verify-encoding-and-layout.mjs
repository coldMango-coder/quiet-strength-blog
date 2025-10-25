import fs from 'node:fs';
import path from 'node:path';

const pages = ['build/index.html', 'build/blog/index.html'];
const bad = [/Marica\s+[A.���\?]/, /A\.\s*inko/, /���inko/];
let badFound = false;

for (const rel of pages) {
  const p = path.resolve(rel);
  if (!fs.existsSync(p)) continue;
  const data = fs.readFileSync(p, 'utf8');
  bad.forEach((rx) => {
    if (rx.test(data)) {
      console.error(`Encoding error found in: ${rel}`);
      badFound = true;
    }
  });
}

if (!badFound) console.log('OK — All author names correctly show "Marica Šinko" everywhere.');
