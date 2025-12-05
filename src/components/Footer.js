import React from 'react';

function year() { return new Date().getFullYear(); }
function shortSha() {
  const sha = process.env.REACT_APP_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || '';
  return sha ? sha.substring(0, 7) : '';
}

export default function Footer() {
  const sha = shortSha();
  return (
    <footer className="w-full bg-[var(--footer-bg,#0f172a)] text-[var(--footer-text,#e2e8f0)] mt-24 border-t">
      <div className="qs-container mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <h4 className="font-bold text-white">Quiet Strength</h4>
          <p className="mt-2 max-w-[40ch]">Empowering introverted women to thrive.</p>
        </div>
        <nav className="space-y-2">
          <a
            href="/#about"
            onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); const el = document.getElementById('about'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }}
            className="block hover:underline text-white/90 hover:text-white"
          >About</a>
          <a
            href="/#blog"
            onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); const el = document.getElementById('blog'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }}
            className="block hover:underline text-white/90 hover:text-white"
          >Blog</a>
          <a
            href="/#books"
            onClick={(e) => { if (window.location.pathname === '/') { e.preventDefault(); const el = document.getElementById('books'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); } }}
            className="block hover:underline text-white/90 hover:text-white"
          >Books</a>
          <a href="/privacy-policy" className="block hover:underline text-white/90 hover:text-white">Privacy Policy</a>
          <a href="/terms" className="block hover:underline text-white/90 hover:text-white">Terms of Use</a>
        </nav>
        <div className="text-sm md:text-right">
          <div>&copy; {year()} Quiet Strength — Empowering introverted women to thrive.</div>
        </div>
      </div>
    </footer>
  );
}



