import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Safe SPA initialization with guards to prevent double initialization
function startApp() {
  // Prevent multiple initialization attempts
  if (window.__APP_STARTED__) {
    console.warn('App already started, skipping duplicate initialization');
    return;
  }
  window.__APP_STARTED__ = true;

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

    // Performance monitoring
    reportWebVitals();
    
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