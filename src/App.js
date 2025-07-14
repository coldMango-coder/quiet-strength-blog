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
import Seo from './components/Seo';
import QuietConfidenceBook from './pages/books/QuietConfidenceBook';

function App() {
  const [activePage, setActivePage] = useState({ page: 'home', category: null, slug: null });

  const navigateTo = (page, category = null, slug = null) => {
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
          />
        );
      case 'book-quiet-confidence':
        return <QuietConfidenceBook onBack={() => navigateTo('home')} />;
      default:
        return (
          <>
            <Seo
              title="Homepage"
              description="Welcome to Quiet Strength, a sanctuary for introverted women seeking to build confidence, prevent burnout, and achieve sustainable success."
              path="/"
            />
            <Hero />
            <About />
            <Blog onNavigate={navigateTo} />
            <Themes onNavigate={navigateTo} />
            <Books onNavigate={navigateTo} />
            <Newsletter />
            <Testimonials />
          </>
        );
    }
  };

  return (
    <HelmetProvider>
      <div className="bg-gray-50">
        <Header />
        <main>{renderPage()}</main>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;