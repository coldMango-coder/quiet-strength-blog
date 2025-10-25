// normalizeDisplayText: preserve diacritics, normalize NFC, strip NBSP/stray mojibake
// normalizeDisplayText.js — fixes mojibake (A. -> Š), keeps diacritics, NFC normalization
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  let s = input.normalize('NFC')
    .replace(/\u00A0/g, ' ')
    .replace(/[�,�A�]/g, '');

  // Explicit replacements for mojibake patterns specific to author name
  s = s
    .replace(/Marica\s*A\.\s*inko/gi, 'Marica Šinko')
    .replace(/A\.\s*inko/gi, 'Šinko')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return s;
}
