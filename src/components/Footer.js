import React from 'react';

const Footer = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-slate-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">Quiet Strength</h3>
            <p className="text-slate-400">Empowering introverted women to thrive.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <button 
                onClick={() => onNavigate && onNavigate('about')} 
                className="text-slate-400 hover:text-white text-left"
              >
                About
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('themes')} 
                className="text-slate-400 hover:text-white text-left"
              >
                Themes
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('blog')} 
                className="text-slate-400 hover:text-white text-left"
              >
                Blog
              </button>
              <button 
                onClick={() => onNavigate && onNavigate('books')} 
                className="text-slate-400 hover:text-white text-left"
              >
                Books
              </button>
            </nav>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <button className="text-slate-400 hover:text-white text-left">Privacy Policy</button>
            </nav>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-400">
          <p>&copy; {currentYear} Quiet Strength. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;