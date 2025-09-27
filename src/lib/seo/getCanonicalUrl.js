/**
 * Generates canonical URLs for trueallyguide.com pages
 * Ensures EXACT match between canonical URLs and live page URLs
 * @param {string} pathname - The pathname from router (e.g., '/blog/post')
 * @returns {string} - The canonical URL that exactly matches the live URL
 */
export function getCanonicalUrl(pathname) {
  // Use production domain by default to avoid leaking localhost into canonicals
  const defaultBase = 'https://trueallyguide.com';
  const baseUrl = process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : defaultBase);

  // Normalize pathname with strict rules
  let normalizedPath = pathname || '/';

  // Strip query and hash for canonical
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];

  // Lowercase for consistency
  normalizedPath = normalizedPath.toLowerCase();

  // Ensure trailing slash policy consistent with pre-renderer: always slash
  if (!normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath === '' ? '/' : `${normalizedPath}/`;
  }

  // Construct canonical URL
  return `${baseUrl}${normalizedPath}`;
}
