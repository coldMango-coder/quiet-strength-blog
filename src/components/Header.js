import React, { useState } from 'react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#home">
          <img src="/images/logo.png" alt="Quiet Strength Logo" className="h-10" />
        </a>
        <nav className="hidden md:flex space-x-8">
          <a href="#about" className="text-slate-600 hover:text-indigo-600">About</a>
          <a href="#themes" className="text-slate-600 hover:text-indigo-600">Themes</a>
          <a href="#blog" className="text-slate-600 hover:text-indigo-600">Blog</a>
          <a href="#books" className="text-slate-600 hover:text-indigo-600">Books</a>
          <a href="#contact" className="text-slate-600 hover:text-indigo-600">Contact</a>
        </nav>
        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className="text-slate-800 focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={!isOpen ? "M4 6h16M4 12h16M4 18h16" : "M6 18L18 6M6 6l12 12"}></path>
            </svg>
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden bg-white">
          <a href="#about" className="block px-6 py-2 text-slate-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>About</a>
          <a href="#themes" className="block px-6 py-2 text-slate-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Themes</a>
          <a href="#blog" className="block px-6 py-2 text-slate-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Blog</a>
          <a href="#books" className="block px-6 py-2 text-slate-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Books</a>
          <a href="#contact" className="block px-6 py-2 text-slate-600 hover:bg-gray-100" onClick={() => setIsOpen(false)}>Contact</a>
        </div>
      )}
    </header>
  );
};

export default Header;