// src/App.js

import React, { useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Themes from './components/Themes';
import Blog from './components/Blog';
import Books from './components/Books';
import Newsletter from './components/Newsletter';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import BlogPage from './pages/BlogPage';
import CategoryPage from './pages/CategoryPage';
import Seo from './components/Seo';
import QuietConfidenceBook from './pages/books/QuietConfidenceBook';

function App() {
  const [activePage, setActivePage] = useState({ page: 'home', category: null, slug: null });

  const navigateTo = (page, category = null, slug = null) => {
    // If we're trying to navigate to a section (about, themes, books) OR blog section without slug
    if ((page === 'about' || page === 'themes' || page === 'books') || (page === 'blog' && !slug)) {
      // If we're already on the home page, just scroll to the section
      if (activePage.page === 'home') {
        const element = document.getElementById(page);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        return;
      } else {
        // If we're on a different page, navigate to home first, then scroll to section
        setActivePage({ page: 'home', category: null, slug: null });
        setTimeout(() => {
          const element = document.getElementById(page);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
        return;
      }
    }
    
    // For other navigation (home, specific blog posts, etc.)
    setActivePage({ page, category, slug });
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (activePage.page) {
      case 'blog':
        return (
          <BlogPage
            onBack={() => navigateTo('home')}
            category={activePage.category}
            slug={activePage.slug}
            onNavigate={navigateTo}
          />
        );
      case 'category':
        return (
          <CategoryPage
            onBack={() => navigateTo('home')}
            categoryName={activePage.category}
            onNavigate={navigateTo}
          />
        );
      case 'book-quiet-confidence':
        return <QuietConfidenceBook onBack={() => navigateTo('home')} />;
      default:
        return (
          <>
            <Seo
              title="Quiet Strength – Self-Help & Productivity for Introverted Women"
              description="Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms."
              path="/"
            />
            <div className="space-y-24">
              <Hero onNavigate={navigateTo} />
              <About onNavigate={navigateTo} />
              <Blog onNavigate={navigateTo} />
              <Themes onNavigate={navigateTo} />
              <Books onNavigate={navigateTo} />
              <Newsletter />
              <Testimonials />
            </div>
          </>
        );
    }
  };

  return (
    <HelmetProvider>
      <div className="bg-brand-light">
        <Header onNavigate={navigateTo} activePage={activePage} />
        <main id="main-content" className="container mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-24">
            <div className="lg:col-span-8">
              {renderPage()}
            </div>
            <aside className="hidden lg:block lg:col-span-4 py-24">
              {/* This is the intentional empty space for the asymmetrical layout */}
              {/* You can add testimonials or other elements here later */}
            </aside>
          </div>
        </main>
        <Footer onNavigate={navigateTo} />
      </div>
    </HelmetProvider>
  );
}

export default App;