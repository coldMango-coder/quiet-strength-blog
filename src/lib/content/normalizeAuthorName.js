// normalizeAuthorName: fixes mojibake and ensures correct diacritics for author name
export function normalizeAuthorName(name) {
  return (name || '')
    .replace(/ï¿½Å inko/g, 'Å inko')
    .replace(/\bMarica\s+Å inko\b/g, 'Marica Å inko')
    .replace(/\bMarica\s+\Å inko\b/g, 'Marica Å inko');
}

