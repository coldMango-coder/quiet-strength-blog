import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-slate-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">Quiet Strength</h3>
            <p className="text-slate-200">Empowering introverted women to thrive.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/#about"
                className="text-slate-200 hover:text-white text-left"
              >
                About
              </Link>
              <Link 
                to="/#themes"
                className="text-slate-200 hover:text-white text-left"
              >
                Themes
              </Link>
              <Link 
                to="/blog"
                className="text-slate-200 hover:text-white text-left"
              >
                Blog
              </Link>
              <Link 
                to="/#books"
                className="text-slate-200 hover:text-white text-left"
              >
                Books
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <button className="text-slate-200 hover:text-white text-left">Privacy Policy</button>
            </nav>
          </div>
        </div>
        <div className="mt-12 border-t border-slate-700 pt-8 text-center text-slate-200">
          <p>&copy; {currentYear} Quiet Strength. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;