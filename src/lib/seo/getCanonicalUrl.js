/**
 * Generates canonical URLs for trueallyguide.com pages
 * Ensures EXACT match between canonical URLs and live page URLs
 * @param {string} pathname - The pathname from router (e.g., '/blog/post')
 * @returns {string} - The canonical URL that exactly matches the live URL
 */
export function getCanonicalUrl(pathname) {
  // Use environment variable for base URL, with fallback
  const baseUrl = process.env.REACT_APP_SITE_URL || 
                  (process.env.NODE_ENV === 'production' ? 'https://trueallyguide.com' : 'http://localhost:3001');
  
  // Normalize pathname with strict rules
  let normalizedPath = pathname || '/';
  
  // Remove query parameters and hash
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];
  
  // Convert to lowercase for consistency
  normalizedPath = normalizedPath.toLowerCase();
  
  // Handle trailing slashes based on Vercel config - all paths should have trailing slash
  if (!normalizedPath.endsWith('/')) {
    normalizedPath += '/';
  }
  
  // Construct canonical URL
  return `${baseUrl}${normalizedPath}`;
}