/**
 * Generates canonical URLs for trueallyguide.com pages
 * Ensures single, consistent canonical URL per page to prevent conflicts
 * @param {string} pathname - The pathname from router (e.g., '/blog/post')
 * @returns {string} - The canonical URL
 */
export function getCanonicalUrl(pathname) {
  const baseUrl = 'https://trueallyguide.com';
  
  // Normalize pathname with strict rules
  let normalizedPath = pathname || '/';
  
  // Remove query parameters and hash
  normalizedPath = normalizedPath.split('?')[0].split('#')[0];
  
  // Remove trailing slash except for root
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Convert to lowercase for consistency
  normalizedPath = normalizedPath.toLowerCase();
  
  // Special handling for common paths to prevent conflicts
  const pathMap = {
    '/about': '/about',
    '/blog': '/blog', 
    '/': '/'
  };
  
  // Use mapped path if available to ensure consistency
  if (pathMap[normalizedPath]) {
    normalizedPath = pathMap[normalizedPath];
  }
  
  // For root, return exact base URL with trailing slash
  if (normalizedPath === '/') {
    return `${baseUrl}/`;
  }
  
  // For all other paths, no trailing slash
  return `${baseUrl}${normalizedPath}`;
}