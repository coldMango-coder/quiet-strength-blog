import React, { useState, useEffect } from 'react';
import NormalizedLink from './NormalizedLink';
import { categories, categorySlugMap } from '../blogData';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-sm py-3'
          : 'bg-white lg:bg-transparent py-4 lg:py-5'
        }`}
    >
      <div className="container-wide flex items-center justify-between">
        {/* Logo */}
        <NormalizedLink to="/" className="relative z-50 flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-primary to-orange-400 flex items-center justify-center text-white font-serif font-bold text-xl shadow-md group-hover:shadow-lg transition-all duration-300">
            QS
          </div>
          <span className={`font-serif font-bold text-xl tracking-tight transition-colors duration-300 ${isScrolled ? 'text-brand-emphasis' : 'text-brand-emphasis'
            }`}>
            Quiet Strength
          </span>
        </NormalizedLink>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          <NormalizedLink
            to="/"
            className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
          >
            Home
          </NormalizedLink>

          <div className="relative group">
            <button
              className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors py-2"
              onClick={() => toggleDropdown('categories')}
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              Topics
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute top-full left-1/2 -translate-x-1/2 w-64 pt-2 transition-all duration-200 ${activeDropdown === 'categories' ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                }`}
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <div className="bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden p-2">
                {Object.keys(categories).map((key) => (
                  <NormalizedLink
                    key={key}
                    to={`/category/${categorySlugMap[categories[key]]}`}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-orange-50 hover:text-brand-primary rounded-lg transition-colors"
                  >
                    {categories[key]}
                  </NormalizedLink>
                ))}
                <div className="h-px bg-gray-100 my-2"></div>
                <NormalizedLink
                  to="/blog"
                  className="block px-4 py-2.5 text-sm font-semibold text-brand-primary hover:bg-orange-50 rounded-lg transition-colors"
                >
                  View All Articles
                </NormalizedLink>
              </div>
            </div>
          </div>

          <NormalizedLink
            to="/about"
            className="text-sm font-medium text-gray-600 hover:text-brand-primary transition-colors"
          >
            About
          </NormalizedLink>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:block">
          <a
            href="#newsletter"
            className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-bold text-white transition-all duration-200 bg-brand-primary rounded-full hover:bg-brand-emphasis hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
          >
            Join Newsletter
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden relative z-50 p-2 text-gray-600 hover:text-brand-primary transition-colors"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-white z-40 transition-transform duration-300 lg:hidden flex flex-col pt-24 px-6 ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <nav className="flex flex-col gap-6 text-center">
          <NormalizedLink
            to="/"
            className="text-xl font-medium text-brand-dark hover:text-brand-primary"
            onClick={toggleMobileMenu}
          >
            Home
          </NormalizedLink>
          <NormalizedLink
            to="/blog"
            className="text-xl font-medium text-brand-dark hover:text-brand-primary"
            onClick={toggleMobileMenu}
          >
            Blog
          </NormalizedLink>
          <NormalizedLink
            to="/about"
            className="text-xl font-medium text-brand-dark hover:text-brand-primary"
            onClick={toggleMobileMenu}
          >
            About
          </NormalizedLink>

          <div className="h-px bg-gray-100 my-2"></div>

          <div className="flex flex-col gap-4">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-wider">Topics</span>
            {Object.keys(categories).map((key) => (
              <NormalizedLink
                key={key}
                to={`/category/${categorySlugMap[categories[key]]}`}
                className="text-lg text-gray-600 hover:text-brand-primary"
                onClick={toggleMobileMenu}
              >
                {categories[key]}
              </NormalizedLink>
            ))}
          </div>

          <div className="mt-8">
            <a
              href="#newsletter"
              className="block w-full py-4 text-lg font-bold text-white bg-brand-primary rounded-xl shadow-lg hover:bg-brand-emphasis transition-colors"
              onClick={toggleMobileMenu}
            >
              Join Newsletter
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
