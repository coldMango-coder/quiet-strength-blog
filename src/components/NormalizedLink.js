import React from 'react';
import { Link } from 'react-router-dom';
import { normalizeHref } from '../lib/seo/normalizeHref';

/**
 * A wrapper around React Router's Link component that automatically normalizes hrefs
 * to ensure consistency with canonical URLs
 */
const NormalizedLink = ({ to, href, children, ...props }) => {
  // Support both 'to' (React Router) and 'href' (HTML anchor) props
  const originalHref = to || href;
  
  if (!originalHref) {
    return <a {...props}>{children}</a>;
  }
  
  let normalizedHref = normalizeHref(originalHref);
  
  // Handle null/undefined normalized href
  if (!normalizedHref || typeof normalizedHref !== 'string') {
    return <a {...props}>{children}</a>;
  }
  
  // Check if this is an external link or special link type
  const BASE = (process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : ''));
  const isOurDomainAbsolute = /^https?:\/\/(www\.)?trueallyguide\.com/i.test(normalizedHref);
  // Ensure URI encoding for any diacritics or spaces in internal hrefs
  if (typeof normalizedHref === 'string') {
    try {
      // Preserve hash/query while encoding path safely
      const [pathPart, rest = ''] = normalizedHref.split(/([?#].*)/);
      const encodedPath = encodeURI(pathPart);
      normalizedHref = `${encodedPath}${rest || ''}`;
    } catch {}
  }

  const isExternal = normalizedHref.startsWith('http') && !isOurDomainAbsolute;
  const isSpecial = normalizedHref.startsWith('mailto:') || 
                   normalizedHref.startsWith('tel:') || 
                   normalizedHref.startsWith('#');
  
  // Use regular anchor tag for external links and special links
  if (isExternal || isSpecial) {
    return (
      <a href={normalizedHref} {...props}>
        {children}
      </a>
    );
  }
  
  // Convert full URLs back to relative paths for React Router
  let routerPath = normalizedHref;
  if (isOurDomainAbsolute) {
    routerPath = normalizedHref.replace(/^https?:\/\/(www\.)?trueallyguide\.com/i, '') || '/';
  } else if (BASE && normalizedHref.startsWith(BASE)) {
    routerPath = normalizedHref.replace(BASE, '') || '/';
  }
  
  // Use React Router Link for internal navigation (supports hash scrolling via App.js effect)
  return <Link to={routerPath} {...props}>{children}</Link>;
};

export default NormalizedLink;
