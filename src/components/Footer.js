import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer id="contact" className="bg-slate-800 text-white pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-xl font-bold mb-4">Quiet Strength</h3>
            <p className="text-slate-400">Empowering introverted women to thrive.</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#about" className="text-slate-400 hover:text-white">About</a>
              <a href="#themes" className="text-slate-400 hover:text-white">Themes</a>
              <a href="#blog" className="text-slate-400 hover:text-white">Blog</a>
              <a href="#books" className="text-slate-400 hover:text-white">Books</a>
            </nav>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#" className="text-slate-400 hover:text-white">Privacy Policy</a>
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