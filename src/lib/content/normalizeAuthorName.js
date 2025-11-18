// normalizeAuthorName: fixes mojibake and ensures correct diacritics for author name
export function normalizeAuthorName(name) {
  return (name || '')
    .replace(/�Šinko/g, 'Šinko')
    .replace(/\bMarica\s+Šinko\b/g, 'Marica Šinko')
    .replace(/\bMarica\s+\Šinko\b/g, 'Marica Šinko');
}

