import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import NormalizedLink from './NormalizedLink';
import { categorySlugMap } from '../blogData';
import OptimizedImage from './OptimizedImage';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const isArticle = location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const [isCatOpen, setIsCatOpen] = useState(false);
  const [catPos, setCatPos] = useState({ left: 0, top: 0, width: 0 });
  const catRef = useRef(null);
  const catBtnRef = useRef(null);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
          const scrollPosition = window.scrollY;
          setProgress((scrollPosition / totalHeight) * 100);
          setIsScrolled(scrollPosition > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll, { passive: true });
    };
  }, []);

  // Close category dropdown on outside click / Esc
  useEffect(() => {
    const onClick = (e) => {
      if (isCatOpen && catRef.current && !catRef.current.contains(e.target)) {
        setIsCatOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setIsCatOpen(false);
    };
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [isCatOpen]);

  // Recompute dropdown absolute position
  useEffect(() => {
    const updatePos = () => {
      const btn = catBtnRef.current;
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      setCatPos({ left: Math.round(r.left), top: Math.round(r.bottom + 8), width: Math.round(r.width) });
    };
    if (isCatOpen) {
      updatePos();
      window.addEventListener('resize', updatePos);
      window.addEventListener('scroll', updatePos, { passive: true });
      return () => {
        window.removeEventListener('resize', updatePos);
        window.removeEventListener('scroll', updatePos);
      };
    }
  }, [isCatOpen]);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const original = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      return () => { document.documentElement.style.overflow = original; };
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'About', page: 'about', icon: null },
    { name: 'Category', page: 'category', icon: null, hasDropdown: true },
    { name: 'Blog', page: 'blog', icon: null },
    { name: 'Books', page: 'books', href: '/book-quiet-confidence', icon: null },
  ];

  const fallbackCategories = [
    { name: 'Introversion & Personality', slug: 'introversion-and-personality' },
    { name: 'Relationships & Dating', slug: 'relationships-and-dating' },
    { name: 'Career & Workplace', slug: 'career-and-workplace' },
    { name: 'Self-Development', slug: 'self-development' },
    { name: "Women's Wellness", slug: 'womens-wellness' },
  ];

  const categoryItems = (() => {
    try {
      const entries = categorySlugMap && Object.entries(categorySlugMap);
      if (entries && entries.length) {
        return entries.map(([name, slug]) => ({ name, slug }));
      }
    } catch { }
    return fallbackCategories;
  })();

  return (
    <>
      {isArticle && (<div id="read-progress" style={{ width: `${progress}%`, pointerEvents: "none" }} className="fixed top-0 left-0 h-1 bg-brand-primary z-[9999]"></div>)}

      <header className={`sticky top-0 z-50 transition-all duration-300 border-b ${isScrolled ? 'bg-white/95 backdrop-blur-sm border-gray-200 shadow-sm py-2' : 'bg-white border-transparent py-4'}`}>
        <a href="#main" className="sr-only focus:not-sr-only">Skip to main content</a>

        <div className="container-wide flex justify-between items-center">
          {/* Logo */}
          <NormalizedLink to="/">
            <a
              href="/"
              aria-label="Home"
              className="flex items-center gap-3 group"
              onClick={(e) => { try { if (window.location.pathname === '/') { e.preventDefault(); window.location.reload(); } } catch { } }}
            >
              <div className={`relative transition-all duration-300 ${isScrolled ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl overflow-hidden shadow-sm group-hover:shadow-md`}>
                <OptimizedImage
                  src="/images/logo.avif"
                  alt="Quiet Strength Logo"
                  className="w-full h-full object-cover"
                  width={48}
                  height={48}
                  priority={true}
                />
              </div>
              <span className={`font-serif font-bold text-brand-emphasis tracking-tight transition-all duration-300 ${isScrolled ? 'text-xl' : 'text-2xl'}`}>
                Quiet Strength
              </span>
            </a>
          </NormalizedLink>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link => (
              <div
                key={link.name}
                className={`relative ${link.hasDropdown ? 'nav-cat' : ''}`}
                onMouseEnter={link.hasDropdown ? () => setIsCatOpen(true) : undefined}
              >
                {link.hasDropdown ? (
                  <div ref={catRef}>
                    <button
                      ref={catBtnRef}
                      onClick={() => setIsCatOpen((v) => !v)}
                      className={`text-sm font-medium transition-colors duration-200 flex items-center gap-1 ${isCatOpen ? 'text-brand-primary' : 'text-brand-dark hover:text-brand-primary'}`}
                      aria-expanded={isCatOpen}
                      type="button"
                    >
                      <span>{link.name}</span>
                      <svg className={`w-4 h-4 transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>

                    {isCatOpen && ReactDOM.createPortal(
                      <div
                        ref={catRef}
                        role="menu"
                        style={{
                          position: 'fixed',
                          left: `${catPos.left}px`,
                          top: `${catPos.top}px`,
                          minWidth: '260px',
                          zIndex: 10050,
                        }}
                        className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
                        onMouseEnter={() => setIsCatOpen(true)}
                        onMouseLeave={() => setIsCatOpen(false)}
                      >
                        <div className="px-4 py-2 border-b border-gray-50 bg-gray-50/50">
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Browse Categories</span>
                        </div>
                        {categoryItems.map(({ name, slug }) => (
                          <button
                            key={slug}
                            onClick={() => { window.location.href = `/category/${slug}`; setIsCatOpen(false); }}
                            className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-brand-secondary hover:text-brand-primary transition-colors duration-150"
                            role="menuitem"
                          >
                            {name}
                          </button>
                        ))}
                        <div className="border-t border-gray-100 mt-1 pt-1">
                          <a
                            href="/blog"
                            className="block w-full text-left px-4 py-2.5 text-sm font-medium text-brand-primary hover:bg-brand-secondary transition-colors duration-150"
                            onClick={() => setIsCatOpen(false)}
                          >
                            View All Articles &rarr;
                          </a>
                        </div>
                      </div>,
                      document.body
                    )}
                  </div>
                ) : (
                  <NormalizedLink
                    to={link.page === 'blog' ? '/blog' : `/#${link.page}`}
                    className={`text-sm font-medium transition-colors duration-200 ${location.pathname.includes(link.page) ? 'text-brand-primary' : 'text-brand-dark hover:text-brand-primary'}`}
                  >
                    {link.name}
                  </NormalizedLink>
                )}
              </div>
            ))}

            <a
              href="#newsletter"
              className="bg-brand-primary text-white text-sm font-semibold py-2.5 px-6 rounded-full hover:bg-opacity-90 transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              Join Newsletter
            </a>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-brand-dark p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}></path>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {isOpen && ReactDOM.createPortal(
          <div className="fixed inset-0 z-[2000] bg-white overflow-y-auto">
            <div className="container-wide py-4 flex justify-between items-center border-b border-gray-100">
              <span className="font-serif font-bold text-xl text-brand-emphasis">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 p-2 rounded-md hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="container-wide py-8 flex flex-col gap-6">
              {navLinks.map(link => (
                <div key={link.name} className="border-b border-gray-50 pb-4">
                  {link.hasDropdown ? (
                    <div className="space-y-4">
                      <span className="text-lg font-semibold text-brand-dark block mb-2">{link.name}</span>
                      <div className="grid grid-cols-1 gap-2 pl-4 border-l-2 border-brand-secondary">
                        {categoryItems.map(({ name, slug }) => (
                          <button
                            key={slug}
                            onClick={() => {
                              window.location.href = `/category/${slug}`;
                              setIsOpen(false);
                            }}
                            className="text-left text-base text-gray-600 hover:text-brand-primary py-1"
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NormalizedLink
                      to={link.page === 'blog' ? '/blog' : `/#${link.page}`}
                      onClick={() => setIsOpen(false)}
                      className="text-lg font-semibold text-brand-dark block"
                    >
                      {link.name}
                    </NormalizedLink>
                  )}
                </div>
              ))}
              <a
                href="#newsletter"
                onClick={() => setIsOpen(false)}
                className="bg-brand-primary text-white text-center font-semibold py-3 px-6 rounded-full mt-4"
              >
                Join Newsletter
              </a>
            </nav>
          </div>,
          document.body
        )}
      </header>
    </>
  );
};

export default Header;
