/**
 * Generates canonical URLs for trueallyguide.com pages
 * Ensures EXACT match between canonical URLs and live page URLs
 * @param {string} pathname - The pathname from router (e.g., '/blog/post')
 * @returns {string} - The canonical URL that exactly matches the live URL
 */
export function getCanonicalUrl(pathname) {
  const baseUrl = 'https://trueallyguide.com';
  
  // Normalize pathname with strict rules
  let normalizedPath = pathname || '/';
  
  // Remove query parameters and hash
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];
  
  // Convert to lowercase for consistency
  normalizedPath = normalizedPath.toLowerCase();
  
  // Remove trailing slash except for root to match live URLs
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Ensure root path has trailing slash (matches live URL)
  if (normalizedPath === '' || normalizedPath === '/') {
    return `${baseUrl}/`;
  }
  
  // All other paths: no trailing slash (matches live URLs exactly)
  return `${baseUrl}${normalizedPath}`;
}