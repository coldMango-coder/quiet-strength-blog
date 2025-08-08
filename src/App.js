// src/App.js

import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
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
  // Initialize dynamic SEO updates for client-side navigation
  useDynamicSEO();
  
  // DEV-ONLY: Ensure canonical tags exist before React hydration
  useDevCanonicalFallback();
  
  return (
    <div className="bg-brand-light">
      <Header />
      <main id="main-content" className="container mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-8">
            <Suspense fallback={<div className="flex justify-center items-center py-24"><div className="text-brand-primary">Loading...</div></div>}>
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
          <aside className="hidden lg:block lg:col-span-4 py-24">
            {/* This is the intentional empty space for the asymmetrical layout */}
          </aside>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;