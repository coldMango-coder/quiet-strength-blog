/**
 * Generates canonical URLs for trueallyguide.com pages
 * Ensures EXACT match between canonical URLs and live page URLs
 * @param {string} pathname - The pathname from router (e.g., '/blog/post')
 * @returns {string} - The canonical URL that exactly matches the live URL
 */
export function getCanonicalUrl(pathname) {
  // Use environment variable for base URL, with fallback to current origin
  const baseUrl = process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');
  
  // Normalize pathname with strict rules
  let normalizedPath = pathname || '/';
  
  // Remove query parameters and hash
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];
  
  // Convert to lowercase for consistency
  normalizedPath = normalizedPath.toLowerCase();
  
  // Remove trailing slash except for root
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Construct canonical URL
  return `${baseUrl}${normalizedPath}`;
}
