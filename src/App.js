// src/App.js

import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useDynamicSEO } from './hooks/useDynamicSEO';
import { useDevCanonicalFallback } from './hooks/useDevCanonicalFallback';
import './styles/typography.css';

// Lazy load all page components
// Load the homepage eagerly to avoid CLS from Suspense fallback on first paint
import HomePage from './pages/HomePage';
const PrivacyPolicy = React.lazy(() => import('./pages/PrivacyPolicy'));
const Terms = React.lazy(() => import('./pages/Terms'));
const BlogListPage = React.lazy(() => import('./pages/BlogListPage'));
const BlogPostPage = React.lazy(() => import('./pages/BlogPostPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const QuietConfidenceBook = React.lazy(() => import('./pages/books/QuietConfidenceBook'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

function App() {
  // No-op build tag to change main bundle hash when needed
  const __BUILD_TAG = '2025-10-18T12:45:00Z';
  // Initialize dynamic SEO updates for client-side navigation
  useDynamicSEO();
  
  // DEV-ONLY: Ensure canonical tags exist before React hydration
  useDevCanonicalFallback();
  const location = useLocation();

  // Smoothly scroll to hash targets after route changes
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Delay until content mounts
      const t = setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
      return () => clearTimeout(t);
    }
  }, [location.pathname, location.hash]);

  // Ensure we scroll to top when navigating between routes without hashes
  useEffect(() => {
    if (!location.hash) {
      // Use instant/auto scroll to avoid jank when switching pages
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  // Sanitize any mis-encoded characters in prerendered content (defensive fix)
  useEffect(() => {
    const fixText = (s) => s
      .replace(/â€¢/g, '•')
      .replace(/��/g, '•')
      .replace(/�/g, '•')
      .replace(/�/g, '•')
      .replace(/�/g, '•')
      .replace(/�/g, '•')
      .replace(/Å /g, 'Š')
      .replace(/Marica Sinko/g, 'Marica Šinko');

    try {
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
      const texts = [];
      while (walker.nextNode()) texts.push(walker.currentNode);
      texts.forEach(node => {
        const fixed = fixText(node.nodeValue || '');
        if (fixed !== node.nodeValue) node.nodeValue = fixed;
      });
      // Also fix alt attributes on images
      document.querySelectorAll('img[alt]').forEach(img => {
        const alt = img.getAttribute('alt') || '';
        const fixedAlt = fixText(alt);
        if (fixedAlt !== alt) img.setAttribute('alt', fixedAlt);
      });
    } catch {}
  }, [location.pathname]);
  
  const isArticle = location.pathname.startsWith('/blog/') && location.pathname !== '/blog';

  // Defer decorative background texture until idle to avoid offscreen image load
  useEffect(() => {
    let cancel = () => {};
    try {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        // Use proper IdleRequestOptions shape to avoid runtime TypeError
        const idleId = window.requestIdleCallback(
          () => {
            try { document.documentElement.classList.add('bg-texture-enabled'); } catch {}
          },
          { timeout: 2000 }
        );
        cancel = () => { try { window.cancelIdleCallback && window.cancelIdleCallback(idleId); } catch {} };
      } else {
        const t = window.setTimeout(() => {
          try { document.documentElement.classList.add('bg-texture-enabled'); } catch {}
        }, 2000);
        cancel = () => { try { clearTimeout(t); } catch {} };
      }
    } catch {}
    return () => cancel();
  }, []);

  return (
    <div className="bg-brand-light">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded shadow">Skip to content</a>
      <Header />
      <main id="main" className="container mx-auto">
        <div className={isArticle ? 'lg:grid lg:grid-cols-12 lg:gap-8' : 'lg:grid lg:grid-cols-12 lg:gap-24'}>
          <div className={isArticle ? 'lg:col-start-3 lg:col-span-8' : 'lg:col-span-8'}>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/book-quiet-confidence" element={<QuietConfidenceBook />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </Suspense>
          </div>
          {!isArticle && (
            <aside className="hidden lg:block lg:col-span-4 py-24">
              {/* Intentional empty space for asymmetrical layout on non-article pages */}
            </aside>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
