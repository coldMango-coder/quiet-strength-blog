// src/App.js

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import CategoryPage from './pages/CategoryPage';
import QuietConfidenceBook from './pages/books/QuietConfidenceBook';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="bg-brand-light">
      <Header />
      <main id="main-content" className="container mx-auto">
        <div className="lg:grid lg:grid-cols-12 lg:gap-24">
          <div className="lg:col-span-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/blog" element={<BlogListPage />} />
              <Route path="/blog/:slug" element={<BlogPostPage />} />
              <Route path="/category/:categoryName" element={<CategoryPage />} />
              <Route path="/book-quiet-confidence" element={<QuietConfidenceBook />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
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