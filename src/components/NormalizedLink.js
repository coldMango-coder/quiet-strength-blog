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
  
  const normalizedHref = normalizeHref(originalHref);
  
  // Handle null/undefined normalized href
  if (!normalizedHref || typeof normalizedHref !== 'string') {
    return <a {...props}>{children}</a>;
  }
  
  // Check if this is an external link or special link type
  const isExternal = normalizedHref.startsWith('http') && !normalizedHref.startsWith('https://trueallyguide.com');
  const isSpecial = normalizedHref.startsWith('mailto:') || 
                   normalizedHref.startsWith('tel:') || 
                   normalizedHref.startsWith('#') || 
                   normalizedHref.startsWith('javascript:');
  
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
  if (normalizedHref.startsWith('https://trueallyguide.com')) {
    routerPath = normalizedHref.replace('https://trueallyguide.com', '') || '/';
  }
  
  // Use React Router Link for internal navigation
  return (
    <Link to={routerPath} {...props}>
      {children}
    </Link>
  );
};

export default NormalizedLink;