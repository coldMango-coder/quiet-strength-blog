import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { categories } from '../blogData';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPosition = window.scrollY;
      setProgress((scrollPosition / totalHeight) * 100);
      setIsScrolled(scrollPosition > 120);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
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

  const navLinks = [
    { name: 'About', page: 'about', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg> },
    { name: 'Category', page: 'category', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect></svg>, hasDropdown: true },
    { name: 'Blog', page: 'blog', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> },
    { name: 'Books', page: 'books', icon: <svg className="nav-icon" aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg> },
  ];

  return (
    <>
      <div id="read-progress" style={{ width: `${progress}%` }} className="fixed top-0 left-0 h-1 bg-brand-emphasis z-[9999]"></div>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'h-[92px] bg-[#C65616] shadow-lg' : 'h-[128px] bg-[#B44416]'}`}>
        <a href="#main-content" className="sr-only focus:not-sr-only">Skip to main content</a>
        <div className="container mx-auto px-6 flex justify-between items-center h-full">
          <Link to="/" className="focus:outline-none">
            <div className={`modern-logo transition-all duration-300 ${isScrolled ? 'h-12' : 'h-16'} rounded-full overflow-hidden`}>
              <img 
                src="/images/logo.png" 
                alt="Quiet Strength Logo" 
                className="w-full h-full object-cover"
              />
            </div>
          </Link>
          <nav className="hidden lg:flex items-center gap-11">
            {navLinks.map(link => (
              <div
                key={link.name}
                className={`relative ${link.hasDropdown ? 'group' : ''}`}
              >
                {link.hasDropdown ? (
                  <div className="relative">
                    <button
                      className={`relative text-white font-semibold hover:text-[#FFECD8] transition-all duration-300 group transform hover:-translate-y-0.5 ${isScrolled ? 'text-xl py-3' : 'text-2xl py-4'} flex items-center gap-1`}
                    >
                      {link.icon}
                      <span>{link.name}</span>
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                      <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-[#FFECD8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left"></span>
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                      <div className="py-2">
                        {Object.values(categories).map((categoryName) => (
                          <button
                            key={categoryName}
                            onClick={() => window.location.href = `/category/${encodeURIComponent(categoryName)}`}
                            className="w-full text-left px-4 py-3 text-gray-700 hover:bg-brand-light hover:text-brand-emphasis transition-colors duration-200"
                          >
                            {categoryName}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.page === 'blog' ? '/blog' : `/#${link.page}`}
                    onClick={link.page !== 'blog' ? (e) => {
                      if (location.pathname === '/') {
                        e.preventDefault();
                        const element = document.getElementById(link.page);
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    } : undefined}
                    className={`relative text-white font-semibold hover:text-[#FFECD8] transition-all duration-300 group transform hover:-translate-y-0.5 ${isScrolled ? 'text-xl py-3' : 'text-2xl py-4'} ${location.pathname.includes(link.page) ? 'active' : ''}`}
                    aria-current={location.pathname.includes(link.page) ? 'page' : undefined}
                  >
                    {link.icon}
                    <span>{link.name}</span>
                    <span className="absolute left-0 -bottom-2 w-full h-[3px] bg-[#FFECD8] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left group-[.active]:scale-x-100"></span>
                  </Link>
                )}
              </div>
            ))}
            <a href="/newsletter" className="btn--nav ml-8 bg-[#FFECD8] text-[#B44416] font-semibold py-3 px-7 rounded-full hover:brightness-105 transition-all duration-300 text-lg transform translate-y-0.5">Join</a>
            <button id="mode-toggle" aria-label="Toggle dark mode" onClick={toggleDarkMode} className="ml-4 p-2 rounded-full hover:bg-white/20 transition-colors duration-300">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isDarkMode ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>}
              </svg>
            </button>
          </nav>
          <div className="lg:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}></path>
              </svg>
            </button>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`fixed top-0 right-0 h-full w-full bg-white z-40 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} lg:hidden`}>
          <div className="flex justify-end p-6">
            <button onClick={() => setIsOpen(false)} className="text-brand-dark focus:outline-none">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <nav className="flex flex-col items-center justify-center h-full -mt-16 space-y-8">
            {navLinks.map(link => (
              <div key={link.name} className="text-center">
                {link.hasDropdown ? (
                  <div className="space-y-4">
                    <span className="text-2xl text-brand-dark font-semibold">{link.name}</span>
                    <div className="space-y-2">
                      {Object.values(categories).map((categoryName) => (
                        <button
                          key={categoryName}
                          onClick={() => {
                            window.location.href = `/category/${encodeURIComponent(categoryName)}`;
                            setIsOpen(false);
                          }}
                          className="block text-lg text-brand-primary hover:text-brand-emphasis transition-colors duration-300"
                        >
                          {categoryName}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={link.page === 'blog' ? '/blog' : `/#${link.page}`}
                    onClick={(e) => {
                      if (link.page !== 'blog' && location.pathname === '/') {
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
                  </Link>
                )}
              </div>
            ))}
            <a href="/newsletter" className="mt-8 bg-brand-emphasis text-white font-semibold py-3 px-8 rounded-full">Join</a>
          </nav>
        </div>
      </header>
    </>
  );
};

export default Header;