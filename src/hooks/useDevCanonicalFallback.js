import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Development-only canonical fallback hook
 * Ensures canonical tags are present when using React dev server
 * This is ONLY for development - production uses SSG canonicals
 */
export function useDevCanonicalFallback() {
  const location = useLocation();

  useEffect(() => {
    // Only run in development environment
    if (process.env.NODE_ENV === 'production') {
      return;
    }

    const applyCanonical = () => {
      // Only run on client-side and in development
      if (typeof window === 'undefined' || typeof document === 'undefined') return;
      
      try {
        // Check if canonical already exists (avoid duplicates)
        let existingCanonical = document.querySelector('link[rel="canonical"]');
        
        // Build clean canonical URL
        const cleanPath = location.pathname;
        const canonicalPath = cleanPath === '/' ? '/' : cleanPath.replace(/\/$/, '');
        const canonicalUrl = `${window.location.origin}${canonicalPath}`;
        
        if (!existingCanonical) {
          // Create new canonical if none exists
          existingCanonical = document.createElement('link');
          existingCanonical.setAttribute('rel', 'canonical');
          document.head.appendChild(existingCanonical);
          console.log('🔧 DEV: Created canonical fallback');
        }
        
        // Update canonical URL if it's different
        if (existingCanonical.getAttribute('href') !== canonicalUrl) {
          existingCanonical.setAttribute('href', canonicalUrl);
          console.log(`🔧 DEV: Updated canonical to ${canonicalUrl}`);
        }
        
      } catch (error) {
        // Silent fallback - don't break the app
        console.warn('⚠️ DEV: Canonical fallback error:', error.message);
      }
    };

    // Apply canonical immediately
    applyCanonical();
    
    // Cleanup function (though not strictly needed for this use case)
    return () => {
      // In dev, we don't remove canonicals on unmount to avoid flickering
    };
    
  }, [location.pathname]); // Re-run when route changes
}

export default useDevCanonicalFallback;