// Lightweight text sanitizer for stray mojibake characters and spacing issues
// - Normalize to NFC
// - Replace common garbled bytes (�, Â) and NBSPs
// - Collapse repeated spaces
export default function sanitizeText(input) {
  if (input == null) return input;
  try {
    let s = String(input);
    // Unicode normalize
    if (s.normalize) s = s.normalize('NFC');
    // Replace NBSP with space
    s = s.replace(/\u00A0/g, ' ');
    // Remove stray replacement chars and common mojibake remnants
    s = s.replace(/[�]/g, '');
    s = s.replace(/Â/g, '');
    // Collapse multiple spaces
    s = s.replace(/\s{2,}/g, ' ').trim();
    return s;
  } catch {
    return input;
  }
}

