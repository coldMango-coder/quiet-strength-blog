// normalizeDisplayText: preserve diacritics, normalize NFC, strip NBSP/stray mojibake
export default function normalizeDisplayText(input) {
  if (input == null) return input;
  try {
    let s = String(input);
    if (s.normalize) s = s.normalize('NFC');
    s = s.replace(/\u00A0/g, ' ');
    // Remove common stray replacement/currency-like artifacts sometimes introduced by bad encodings
    s = s.replace(/[�]/g, '');
    return s;
  } catch {
    return input;
  }
}

