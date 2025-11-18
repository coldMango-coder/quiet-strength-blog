/**
 * Client-side SEO enhancement script
 * Updates canonical, OG, and Twitter meta tags dynamically
 * Handles tracking parameter removal and schema.org updates
 */
(function() {
  'use strict';
  
  // Configuration
  const TRACKING_PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'gclid', 'fbclid', 'spa'];
  const BASE_URL = (window.__BASE_URL__ || 'https://trueallyguide.com');
  
  /**
   * Updates SEO meta tags based on current URL
   */
  function updateSEO() {
    try {
      const loc = window.location;
      
      // Clean URL by removing tracking parameters
      const url = new URL(loc.href);
      TRACKING_PARAMS.forEach(param => url.searchParams.delete(param));
      
      // Normalize URL (remove trailing slashes except for root)
      let cleanPath = url.pathname;
      if (cleanPath !== '/' && cleanPath.endsWith('/')) {
        cleanPath = cleanPath.slice(0, -1);
      }
      
      // Canonical should not include query or hash
      const cleanUrl = `${BASE_URL}${cleanPath}`;
      
      // Helper functions
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

      // Update canonical URL
      setOrUpdateLink('canonical', cleanUrl);

      // Update Open Graph URL
      setOrUpdateMeta('meta[property="og:url"]', 'property', 'og:url', cleanUrl);

      // Update Twitter URL
      setOrUpdateMeta('meta[name="twitter:url"]', 'name', 'twitter:url', cleanUrl);

      // Update Open Graph type based on path
      const ogType = cleanPath.includes('/blog/') && cleanPath !== '/blog' ? 'article' : 'website';
      setOrUpdateMeta('meta[property="og:type"]', 'property', 'og:type', ogType);

      // Update history state if URL was cleaned
      // Do not mutate history for canonical normalization to avoid confusing users

      console.log('SEO updated:', { canonicalUrl: cleanUrl, ogType });

    } catch (error) {
      console.error('SEO update error:', error);
    }
  }

  /**
   * Injects or updates schema.org structured data
   */
  function updateSchema(data) {
    if (!data) return;
    
    try {
      const scriptId = 'structured-data-dynamic';
      let script = document.getElementById(scriptId);
      
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.id = scriptId;
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(data);
    } catch (error) {
      console.error('Schema update error:', error);
    }
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateSEO);
  } else {
    updateSEO();
  }

  // Update on navigation events
  window.addEventListener('popstate', updateSEO);
  
  // Listen for React Router navigation (if using pushState)
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;
  
  history.pushState = function() {
    originalPushState.apply(history, arguments);
    setTimeout(updateSEO, 0);
  };
  
  history.replaceState = function() {
    originalReplaceState.apply(history, arguments);
    setTimeout(updateSEO, 0);
  };

  // Expose global function for programmatic updates
  window.updateSEO = updateSEO;
  window.updateSchema = updateSchema;
  
})();
