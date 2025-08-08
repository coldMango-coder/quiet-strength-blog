import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook for dynamic SEO meta tag updates
 * Updates canonical, OG, and Twitter meta tags on route changes
 * Strips tracking parameters from canonical URLs
 */
export const useDynamicSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const updateSEO = () => {
      try {
        const loc = window.location;
        
        // Clean URL by removing tracking parameters
        const url = new URL(loc.href);
        const trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'gclid', 'fbclid'];
        trackingParams.forEach(param => url.searchParams.delete(param));
        
        const cleanUrl = url.toString();
        const canonicalUrl = cleanUrl.replace(/\/+$/, '') || cleanUrl; // Remove trailing slashes except root

        // Update canonical link
        const setOrUpdateLink = (rel, href) => {
          let tag = document.querySelector(`link[rel='${rel}']`);
          if (!tag) {
            tag = document.createElement('link');
            tag.setAttribute('rel', rel);
            document.head.appendChild(tag);
          }
          tag.setAttribute('href', href);
        };

        // Update meta tags
        const setOrUpdateMeta = (selector, attrName, attrValue, content) => {
          let tag = document.querySelector(selector);
          if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attrName, attrValue);
            document.head.appendChild(tag);
          }
          tag.setAttribute('content', content);
        };

        // Update canonical URL
        setOrUpdateLink('canonical', canonicalUrl);

        // Update Open Graph URL
        setOrUpdateMeta('meta[property="og:url"]', 'property', 'og:url', canonicalUrl);

        // Update Twitter URL
        setOrUpdateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', canonicalUrl);

        // Update Open Graph type based on path
        const ogType = location.pathname.includes('/blog/') ? 'article' : 'website';
        setOrUpdateMeta('meta[property="og:type"]', 'property', 'og:type', ogType);

        // Add structured data script update trigger
        window.dispatchEvent(new CustomEvent('seo-updated', { 
          detail: { canonicalUrl, path: location.pathname } 
        }));

      } catch (error) {
        console.error('SEO update error:', error);
      }
    };

    // Update SEO on route change
    updateSEO();

    // Also update on popstate (back/forward navigation)
    const handlePopstate = () => updateSEO();
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [location.pathname, location.search]);
};