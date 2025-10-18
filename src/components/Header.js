import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useLocation } from 'react-router-dom';
import NormalizedLink from './NormalizedLink';
import { categories, categorySlugMap } from '../blogData';
import OptimizedImage from './OptimizedImage';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0); const isArticle = location.pathname.startsWith("/blog/") && location.pathname !== "/blog";
  const [isDarkMode, setIsDarkMode] = useState(false);
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
          setIsScrolled(scrollPosition > 120);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Throttle scroll events using passive listeners
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

  // Recompute dropdown absolute position (for portal) when opened or on resize/scroll
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

  useEffect(() => {
    try {
      const prefersDark = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('theme') : null;
      const dark = stored === 'dark' || (!stored && prefersDark);
      if (dark) {
        document.documentElement.classList.add('dark');
        setIsDarkMode(true);
      } else {
        document.documentElement.classList.remove('dark');
        setIsDarkMode(false);
      }
    } catch (e) {
      // Fail-safe: default to light mode without throwing
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    }
    setIsDarkMode(!isDarkMode);
  };

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      const original = document.documentElement.style.overflow;
      document.documentElement.style.overflow = 'hidden';
      return () => { document.documentElement.style.overflow = original; };
    }
  }, [isOpen]);

  const navLinks = [
    { name: 'About', page: 'about', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    { name: 'Category', page: 'category', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>, hasDropdown: true },
    { name: 'Blog', page: 'blog', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> },
    { name: 'Books', page: 'books', href: '/book-quiet-confidence', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> },
  ];

  // Robust category list (fallback if import ever fails in prod build)
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
    } catch {}
    return fallbackCategories;
  })();

  return (
    <>
      {isArticle && (<div id="read-progress" style={{ width: `${progress}%`, pointerEvents: "none" }} className="fixed top-0 left-0 h-1 bg-brand-emphasis z-[9999]"></div>)}
      <header className={`sticky top-0 z-50 transition-colors duration-300 h-[112px] ${isScrolled ? 'bg-[#C65616] shadow-lg' : 'bg-[#B44416]'}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
        <div className="container mx-auto px-6 flex justify-between items-center h-full">
          <NormalizedLink to="/">
            <div className={`modern-logo transition-all duration-300 ${isScrolled ? 'w-12 h-12' : 'w-16 h-16'} rounded-full overflow-hidden bg-white p-0`}>
              <OptimizedImage 
                src="/images/logo.avif" 
                alt="Quiet Strength Logo" 
                className="w-full h-full object-cover"
                width={64}
                height={64}
                priority={true}
                sizes="64px"
              />
            </div>
          </NormalizedLink>
          <nav className="hidden lg:flex items-center gap-8 overflow-visible">
            {navLinks.map(link => (
              <div
                key={link.name}
                className={`relative ${link.hasDropdown ? 'nav-cat pt-2 pb-2' : ''} ${link.hasDropdown && isCatOpen ? 'dropdown-open' : ''}`}
                onMouseEnter={link.hasDropdown ? () => setIsCatOpen(true) : undefined}
              >
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    ref={catRef}
                  >
                    <button
                      ref={catBtnRef}
                      onClick={() => setIsCatOpen((v) => !v)}
                      className={`relative text-white font-semibold hover:text-[#FFECD8] transition-all duration-200 ${isScrolled ? 'text-base py-2' : 'text-lg py-3'} flex items-center gap-1`}
                      aria-label={`${link.name} menu - show categories`}
                      aria-expanded={isCatOpen}
                      aria-haspopup="true"
                      type="button"
                    >
                      {link.icon}
                      <span>{link.name}</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </button>
                    {isCatOpen && ReactDOM.createPortal(
                      <div 
                        ref={catRef}
                        role="menu"
                        aria-label="Category menu"
                        tabIndex={-1}
                        style={{
                          position: 'fixed',
                          left: `${catPos.left}px`,
                          top: `${catPos.top}px`,
                          minWidth: Math.max(catPos.width, 240),
                          zIndex: 10050,
                        }}
                        className="dropdown-panel"
                        onMouseEnter={() => setIsCatOpen(true)}
                        onMouseLeave={() => setIsCatOpen(false)}
                      >
                        <div className="py-2">
                          <a
                            href="/#blog"
                            className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-brand-secondary/60 hover:text-brand-emphasis transition-colors duration-150"
                            role="menuitem"
                            onClick={() => setIsCatOpen(false)}
                          >
                            From the Blog
                          </a>
                          <a
                            href="/blog"
                            className="block w-full text-left px-4 py-3 text-gray-800 hover:bg-brand-secondary/60 hover:text-brand-emphasis transition-colors duration-150"
                            role="menuitem"
                            onClick={() => setIsCatOpen(false)}
                          >
                            All Articles
                          </a>
                          <div className="h-px bg-gray-200 my-1" aria-hidden="true"></div>
                          {categoryItems.map(({ name, slug }) => (
                            <button
                              key={slug}
                              onClick={() => { window.location.href = `/category/${slug}`; setIsCatOpen(false); }}
                              className="w-full text-left px-4 py-3 text-gray-800 hover:bg-brand-secondary/60 hover:text-brand-emphasis transition-colors duration-150"
                              role="menuitem"
                              aria-label={`View ${name} category`}
                              type="button"
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      </div>,
                      document.body
                    )}
                  </div>
                ) : (
                  <NormalizedLink
                    to={link.page === 'blog' ? '/blog' : `/#${link.page}`}
                    onClick={(e) => {
                      if (location.pathname === '/') {
                        e.preventDefault();
                        const element = document.getElementById(link.page);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className={`relative text-white font-semibold hover:text-[#FFECD8] transition-all duration-200 ${isScrolled ? 'text-base py-2' : 'text-lg py-3'} ${location.pathname.includes(link.page) ? 'active' : ''}`}
                    aria-current={location.pathname.includes(link.page) ? 'page' : undefined}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                  </NormalizedLink>
                )}
              </div>
            ))}
            <a href="#newsletter" className="btn--nav ml-8 bg-[#FFECD8] text-[#B44416] font-semibold py-3 px-7 rounded-full hover:brightness-105 transition-all duration-300 text-lg transform translate-y-0.5 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#B44416]" aria-label="Join our newsletter community">Join Newsletter</a>
            <button id="mode-toggle" aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`} onClick={toggleDarkMode} className="ml-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#B44416]" type="button">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                {isDarkMode ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>}
              </svg>
            </button>
          </nav>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#B44416] p-2 rounded-md" aria-label={`${isOpen ? 'Close' : 'Open'} navigation menu`} aria-expanded={isOpen} type="button">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        {isOpen && ReactDOM.createPortal(
          <div className={`fixed inset-0 w-full h-full bg-white z-[2000] overflow-y-auto pt-24 lg:hidden`}
               role="dialog" aria-modal="true" aria-label="Mobile navigation">
            <div className="flex justify-end px-6 pb-4">
              <button onClick={() => setIsOpen(false)} className="text-brand-dark focus:outline-none focus:ring-2 focus:ring-brand-emphasis focus:ring-offset-2 p-2 rounded-md" aria-label="Close navigation menu" type="button">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <nav className="flex flex-col items-center justify-start space-y-8 pb-16">
              {navLinks.map(link => (
                <div key={link.name} className="text-center">
                  {link.hasDropdown ? (
                    <div className="space-y-4">
                      <span className="text-2xl text-brand-dark font-semibold">{link.name}</span>
                      <div className="space-y-2">
                        {categoryItems.map(({ name, slug }) => (
                          <button
                            key={slug}
                            onClick={() => {
                              window.location.href = `/category/${slug}`;
                              setIsOpen(false);
                            }}
                            className="block text-lg text-brand-primary hover:text-brand-emphasis transition-colors duration-300 px-6 py-3"
                            aria-label={`View ${name} category`}
                          >
                            {name}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <NormalizedLink
                      to={link.page === 'blog' ? '/blog' : `/#${link.page}`}
                      onClick={(e) => {
                        if (location.pathname === '/') {
                          e.preventDefault();
                          const element = document.getElementById(link.page);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                          }
                        }
                        setIsOpen(false);
                      }}
                      className="text-2xl text-brand-dark font-semibold hover:text-brand-emphasis transition-colors duration-300"
                    >
                      {link.name}
                    </NormalizedLink>
                  )}
                </div>
              ))}
              <a href="#newsletter" className="mt-8 bg-brand-emphasis text-white font-semibold py-3 px-8 rounded-full">Join</a>
            </nav>
          </div>,
          document.body
        )}
      </header>
    </>
  );
};

export default Header;
