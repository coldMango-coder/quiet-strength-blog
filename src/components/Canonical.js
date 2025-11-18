import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const BASE = process.env.REACT_APP_SITE_URL || (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173');

function normalize(href) {
  try {
    const u = new URL(href, BASE);
    // remove trailing slash except root
    if (u.pathname !== '/' && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.slice(0, -1);
    }
    return u.toString();
  } catch {
    return BASE;
  }
}

export default function Canonical() {
  const { pathname, search } = useLocation();
  const href = normalize(pathname + (search || ''));
  
  return (
    <Helmet>
      <link rel="canonical" href={href} />
    </Helmet>
  );
}
