// src/App.js

import React, { Suspense, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import { useDynamicSEO } from './hooks/useDynamicSEO';
import { useDevCanonicalFallback } from './hooks/useDevCanonicalFallback';

// Lazy load all page components
const HomePage = React.lazy(() => import('./pages/HomePage'));
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
  
  const isArticle = location.pathname.startsWith('/blog/') && location.pathname !== '/blog';

  return (
    <div className="bg-brand-light">
      <Header />
      <main id="main-content" className="container mx-auto">
        <div className={isArticle ? 'lg:grid lg:grid-cols-12 lg:gap-8' : 'lg:grid lg:grid-cols-12 lg:gap-24'}>
          <div className={isArticle ? 'lg:col-start-3 lg:col-span-8' : 'lg:col-span-8'}>
            <Suspense fallback={
              <div className="flex justify-center items-center py-24">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 border-4 border-brand-primary border-t-transparent rounded-full animate-spin mb-4"></div>
                  <div className="text-brand-primary font-medium">Loading content...</div>
                </div>
              </div>
            }>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogListPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/category/:categoryName" element={<CategoryPage />} />
                <Route path="/book-quiet-confidence" element={<QuietConfidenceBook />} />
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
