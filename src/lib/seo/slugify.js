import deburr from 'lodash.deburr';

// Transliterate to ASCII, lowercase, hyphenate, and strip non-url-safe chars
export default function slugify(input) {
  if (!input) return '';
  let s = String(input);
  // Remove diacritics using lodash.deburr
  s = deburr(s);
  // Lowercase
  s = s.toLowerCase();
  // Replace non-word sequences with hyphens
  s = s.replace(/[^a-z0-9]+/g, '-');
  // Trim hyphens
  s = s.replace(/^-+|-+$/g, '');
  return s;
}

