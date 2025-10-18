/**
 * Generates canonical URLs for trueallyguide.com pages
 * Ensures EXACT match between canonical URLs and live page URLs
 * @param {string} pathname - The pathname from router (e.g., '/blog/post')
 * @returns {string} - The canonical URL that exactly matches the live URL
 */
export function getCanonicalUrl(pathname) {
  // Always use the non-www HTTPS canonical host
  const baseUrl = 'https://trueallyguide.com';

  // Normalize pathname with strict rules
  let normalizedPath = pathname || '/';

  // Strip query and hash for canonical
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];

  // Lowercase for consistency
  normalizedPath = normalizedPath.toLowerCase();

  // Trailing slash policy: no trailing slash except for root
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }

  // Construct canonical URL (path only appended to canonical host)
  return `${baseUrl}${normalizedPath}`;
}
