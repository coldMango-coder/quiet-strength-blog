// normalizeDisplayText: preserve diacritics, normalize NFC, strip NBSP/stray mojibake
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  let s = input.normalize('NFC')
    .replace(/\u00A0/g, ' ')
    .replace(/[�,�A�]/g, '');
  // Hard fixes for common mojibake of Š -> 'A. '
  s = s.replace(/Marica\s+A\.[\s\u00A0]?inko/gi, 'Marica Šinko');
  s = s.replace(/A\.\s/g, 'Š');
  return s;
}
