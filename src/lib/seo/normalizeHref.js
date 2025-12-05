/**
 * Normalizes internal links to ensure consistency with canonical URLs
 * @param {string} href - The href attribute to normalize
 * @returns {string} - The normalized href
 */
export function normalizeHref(href) {
  if (!href || typeof href !== 'string') {
    return href;
  }
  
  // Skip external links, mailto, tel, etc.
  if (href.startsWith('http') && !href.startsWith('http://trueallyguide.com') && !href.startsWith('https://trueallyguide.com') && !href.startsWith('http://www.trueallyguide.com') && !href.startsWith('https://www.trueallyguide.com')) {
    return href;
  }
  
  if (href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) {
    return href;
  }
  
  let normalizedHref = href;
  
  // Convert http to https and remove www for our domain (case insensitive)
  normalizedHref = normalizedHref.replace(/^http:\/\/(www\.)?trueallyguide\.com/i, 'https://trueallyguide.com');
  normalizedHref = normalizedHref.replace(/^https:\/\/www\.trueallyguide\.com/i, 'https://trueallyguide.com');
  
  // Extract path for internal links
  let path = normalizedHref;
  if (normalizedHref.startsWith('https://trueallyguide.com')) {
    path = normalizedHref.replace('https://trueallyguide.com', '') || '/';
  }
  
  // Remove query parameters and hash for normalization (but keep in final URL)
  const [pathPart] = path.split(/[?#]/);
  let normalizedPath = pathPart;
  
  // Convert to lowercase
  normalizedPath = normalizedPath.toLowerCase();
  
  // Remove trailing slash except for root
  if (normalizedPath !== '/' && normalizedPath.endsWith('/')) {
    normalizedPath = normalizedPath.slice(0, -1);
  }
  
  // Get query and hash parts from the original href
  const queryHashPart = href.includes('?') || href.includes('#') ? 
    href.substring(href.search(/[?#]/)) : '';
  
  // Return full URL if original was a full URL to our domain, otherwise return relative path
  if (href.toLowerCase().startsWith('http://') || href.toLowerCase().startsWith('https://')) {
    return `https://trueallyguide.com${normalizedPath === '/' ? '/' : normalizedPath}${queryHashPart}`;
  }
  
  // For relative paths, just return the normalized path
  return `${normalizedPath === '/' ? '/' : normalizedPath}${queryHashPart}`;
}
