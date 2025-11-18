// Fix author name encoding across sources to exact: "Marica Šinko"
// Usage: node scripts/fix-author-encoding.mjs
import fs from 'fs';
import path from 'path';

const roots = ['content', 'posts', 'src', 'public', 'data', 'scripts'];
const exts = /\.(mdx?|ya?ml|json|js|jsx|ts|tsx|html|xml|css)$/i;

// Common mojibake and variants observed in repo and guidance
const patterns = [
  /Marica\s*A\u030A\s*inko/gi,
  /Marica\s*A\.[\s\u00A0]*inko/gi,
  /Marica[\s\u00A0]+S(?:\u030C)?inko/gi,
  /Marica\s*Sinko\b/gi,
  /Marica\s*[�?]+inko/gi,
  /Marica\s+\?inko/gi,
  /Marica\s+SIOinko/gi,
  /Marica\s+Ã…\s*inko/gi,
  /Marica\s+Å(?:\s|\u00A0)?inko/gi,
  /Marica\s+Šinko/gi, // normalize spacing
];

const lastNamePatterns = [
  /\bSinko\b/gi,
  /\bS(?:\u030C)?inko\b/gi,
  /[�?]{2}inko/gi,
  /SIOinko/gi,
  /\?inko/gi,
];

function fix(text) {
  let s = text.normalize('NFC');
  // Whole-name fixes first
  for (const p of patterns) s = s.replace(p, 'Marica Šinko');
  // Then last-name-only fixes
  for (const p of lastNamePatterns) s = s.replace(p, 'Šinko');
  // HTML entities for author in public/index.html etc.
  s = s.replace(/Marica\s*&\#352;inko/gi, 'Marica Šinko');
  // Stray encodings inside JSON-LD/meta generators
  s = s.replace(/Marica\s+S(?:inko|i?nko)/g, 'Marica Šinko');
  // Do NOT change file/URL slugs for author assets or routes
  s = s.replace(/marica-Šinko-author-photo/gi, 'marica-sinko-author-photo');
  s = s.replace(/author\/marica-Šinko/gi, 'author/marica-sinko');
  return s;
}

function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (exts.test(e.name)) {
      const raw = fs.readFileSync(p, 'utf8');
      const fixed = fix(raw);
      if (fixed !== raw) {
        fs.writeFileSync(p, fixed, 'utf8');
        console.log('Fixed:', p);
      }
    }
  }
}

for (const r of roots) if (fs.existsSync(r)) walk(r);
console.log('✓ Author strings fixed to "Marica Šinko" across sources.');
