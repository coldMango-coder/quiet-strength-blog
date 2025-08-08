#!/usr/bin/env node

/**
 * Development server with canonical tag injection
 * Ensures canonicals are present in view-source during development
 * This middleware injects canonical tags server-side for dev environments only
 */

const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const PUBLIC_DIR = path.join(__dirname, 'public');
const INDEX_PATH = path.join(PUBLIC_DIR, 'index.html');

// Get page metadata for development routes
function getDevPageMetadata(path) {
  const siteName = 'Quiet Strength';
  
  if (path === '/') {
    return {
      title: `${siteName} – Self-Help & Productivity for Introverted Women`,
      description: 'Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms.'
    };
  }
  
  if (path.includes('/blog/') && path !== '/blog') {
    const slug = path.split('/blog/')[1];
    const title = slug.replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return {
      title: `${title} | ${siteName}`,
      description: `Learn about ${title.toLowerCase()} and build quiet confidence as an introverted woman.`
    };
  }
  
  if (path.includes('/category/')) {
    const category = path.split('/category/')[1];
    const title = category.replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return {
      title: `${title} Articles | ${siteName}`,
      description: `Browse articles about ${title.toLowerCase()} for introverted women seeking confidence and personal growth.`
    };
  }
  
  if (path.includes('/blog')) {
    return {
      title: `Blog | ${siteName}`,
      description: 'Self-help articles and guides for introverted women seeking to build confidence and prevent burnout.'
    };
  }
  
  return {
    title: siteName,
    description: 'Self-help and productivity for introverted women.'
  };
}

// Middleware to inject canonical tags in development
app.use((req, res, next) => {
  // Skip non-HTML requests (assets, API, etc.)
  if (req.path.includes('.') && !req.path.endsWith('.html')) {
    return next();
  }

  try {
    // Read the base index.html
    let html = fs.readFileSync(INDEX_PATH, 'utf8');
    
    // Clean the path (remove query params)
    const cleanPath = req.originalUrl.split('?')[0];
    
    // Build canonical URL for development
    let canonicalPath = cleanPath;
    if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
      canonicalPath = canonicalPath.slice(0, -1);
    }
    const canonicalUrl = `http://localhost:${PORT}${canonicalPath === '/' ? '/' : canonicalPath}`;
    
    // Get metadata for the route
    const metadata = getDevPageMetadata(cleanPath);
    
    // Create canonical and meta injection
    const metaInjection = `
  <!-- DEV-ONLY: Server-side canonical injection -->
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:title" content="${metadata.title}" />
  <meta property="og:description" content="${metadata.description}" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <title>${metadata.title}</title>
  <meta name="description" content="${metadata.description}" />`;

    // Inject before closing head tag
    html = html.replace('</head>', `${metaInjection}\n</head>`);
    
    // Send modified HTML
    res.set('Content-Type', 'text/html');
    res.send(html);
    
  } catch (error) {
    console.error('❌ Error injecting canonical:', error.message);
    next();
  }
});

// Serve static files for assets
app.use(express.static(PUBLIC_DIR));

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Development server with canonical injection running on http://localhost:${PORT}`);
  console.log(`📝 All routes will have canonical tags in view-source`);
  console.log(`🔧 This is for DEVELOPMENT only - production uses SSG canonicals`);
});

module.exports = app;