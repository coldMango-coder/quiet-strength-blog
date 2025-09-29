import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ensureNoSW } from './sw-control';

// Safe SPA initialization with guards to prevent double initialization
function startApp() {
  // Prevent multiple initialization attempts
  if (window.__APP_STARTED__) {
    console.warn('App already started, skipping duplicate initialization');
    return;
  }
  window.__APP_STARTED__ = true;

  // Ensure no stale Service Workers/caches unless explicitly enabled
  try { ensureNoSW(); } catch {}

  // Proactively handle stale chunk errors by forcing a one-time reload
  try {
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (e) => {
        const el = e?.target;
        if (el && el.tagName === 'SCRIPT') {
          const src = el.getAttribute('src') || '';
          if (/\/static\/js\/\d+\./.test(src) && !sessionStorage.getItem('reloadedForChunks')) {
            try { sessionStorage.setItem('reloadedForChunks', '1'); } catch {}
            // Force reload to fetch fresh HTML/asset manifest
            window.location.reload(true);
          }
        }
      }, true);
    }
  } catch {}

  // Ensure root element exists
  const rootElement = document.getElementById('root');
  if (!rootElement) {
    console.error('Root element not found - cannot start app');
    return;
  }

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <BrowserRouter>
          <HelmetProvider>       
            <App />
          </HelmetProvider>   
        </BrowserRouter>
      </React.StrictMode>
    );

    // Optional Service Worker registration (opt-in only)
    if (
      'serviceWorker' in navigator &&
      process.env.NODE_ENV === 'production' &&
      process.env.REACT_APP_ENABLE_SW === 'true'
    ) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/', updateViaCache: 'none' })
          .then(() => {
            console.log('SW registered (opt-in)');
          })
          .catch((error) => {
            console.warn('SW registration failed:', error);
          });
      });
    }

    // Performance monitoring (development only)
    if (process.env.NODE_ENV === 'development') {
      reportWebVitals((metric) => {
        // Log metrics for debugging (dev only)
        console.log(metric.name, Math.round(metric.value));
      });
    }
    
    console.log('SPA initialized successfully');
  } catch (error) {
    console.error('Failed to initialize SPA:', error);
    // Fallback error UI
    rootElement.innerHTML = '<h1>Loading Error</h1><p>Please <a href="/">refresh the page</a>.</p>';
  }
}

// Start app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', startApp, { once: true });
} else {
  // DOM already loaded
  startApp();
}

// Global safety nets to avoid unhandled errors on crawlers/bots
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    // Log non-fatal errors without breaking rendering
    try { console.warn('Captured JS error:', e.message); } catch {}
  });
  window.addEventListener('unhandledrejection', (e) => {
    try { console.warn('Captured unhandled promise:', e.reason); } catch {}
  });
}
