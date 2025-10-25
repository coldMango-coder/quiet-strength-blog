import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { getCanonicalUrl } from '../lib/seo/getCanonicalUrl';

/**
 * Custom hook for dynamic SEO meta tag updates during SPA navigation
 * Ensures canonical URL always matches current page URL exactly
 * Updates canonical, OG, and Twitter meta tags on route changes
 * Strips tracking parameters from canonical URLs
 */
export const useDynamicSEO = () => {
  const location = useLocation();

  useEffect(() => {
    const updateCanonical = () => {
      // Only run on client-side to avoid SSR/CSR mismatches
      if (typeof window === 'undefined') return;
      
      try {
        // Always pin canonical to the production host with path-only policy
        // Strip query/hash and enforce non-www HTTPS domain
        const cleanUrl = getCanonicalUrl(location.pathname || '/');

        // Helper functions to update/create tags
        const setOrUpdateLink = (rel, href) => {
          let tag = document.querySelector(`link[rel='${rel}']`);
          if (!tag) {
            tag = document.createElement('link');
            tag.setAttribute('rel', rel);
            document.head.appendChild(tag);
          }
          tag.setAttribute('href', href);
        };

        const setOrUpdateMeta = (selector, attrName, attrValue, content) => {
          let tag = document.querySelector(selector);
          if (!tag) {
            tag = document.createElement('meta');
            tag.setAttribute(attrName, attrValue);
            document.head.appendChild(tag);
          }
          tag.setAttribute('content', content);
        };

        // Update canonical URL - most critical for SEO
        setOrUpdateLink('canonical', cleanUrl);

        // Update Open Graph URL to match canonical
        setOrUpdateMeta('meta[property="og:url"]', 'property', 'og:url', cleanUrl);

        // Update Twitter URL to match canonical
        setOrUpdateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', cleanUrl);

        // Update Open Graph type based on path
        const isArticle = location.pathname.includes('/blog/') && location.pathname !== '/blog';
        const ogType = isArticle ? 'article' : 'website';
        setOrUpdateMeta('meta[property="og:type"]', 'property', 'og:type', ogType);

        // Avoid manipulating history here to prevent possible redirect loops

        // Debug log for development
        if (process.env.NODE_ENV === 'development') {
          console.log('📍 SEO updated:', { 
            canonical: cleanUrl, 
            type: ogType,
            route: location.pathname 
          });
        }

        // Dispatch event for other components that might need to know about SEO updates
        window.dispatchEvent(new CustomEvent('canonical-updated', { 
          detail: { canonicalUrl: cleanUrl, path: location.pathname, type: ogType } 
        }));

      } catch (error) {
        console.error('❌ SEO update error:', error);
      }
    };

    // Update canonical on route change (critical for SPA navigation)
    updateCanonical();

    // Also update on browser navigation events
    const handlePopstate = () => updateCanonical();
    window.addEventListener('popstate', handlePopstate);

    return () => {
      window.removeEventListener('popstate', handlePopstate);
    };
  }, [location.pathname, location.search]);
};
