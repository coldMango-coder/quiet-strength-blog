/**
 * Generates canonical URLs for trueallyguide.com pages
 * @param {string} pathname - The pathname from router (e.g., '/blog/post')
 * @returns {string} - The canonical URL
 */
export function getCanonicalUrl(pathname) {
  const baseUrl = 'https://trueallyguide.com';
  
  // Normalize pathname
  let normalizedPath = pathname || '/';
  
  // Remove query parameters and hash
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];
  
  // Remove trailing slash except for root
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Convert to lowercase
  normalizedPath = normalizedPath.toLowerCase();
  
  // For root, return exact base URL
  if (normalizedPath === '/') {
    return `${baseUrl}/`;
  }
  
  return `${baseUrl}${normalizedPath}`;
}