// normalizeDisplayText: preserve diacritics, normalize NFC, strip NBSP/stray mojibake
// normalizeDisplayText.js â€” fixes mojibake (A. -> Å ), keeps diacritics, NFC normalization
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  let s = input.normalize('NFC')
    .replace(/\u00A0/g, ' ')
    .replace(/[ï¿½,ï¿½Aï¿½]/g, '');

  // Explicit replacements for mojibake patterns specific to author name
  s = s
    .replace(/Marica\s*A\.\s*inko/gi, 'Marica Å inko')
    .replace(/A\.\s*inko/gi, 'Å inko')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return s;
}
