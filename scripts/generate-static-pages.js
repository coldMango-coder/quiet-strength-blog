#!/usr/bin/env node

/**
 * Simple static page generation for server-side canonical tags
 * Creates HTML files with correct canonical tags without requiring Puppeteer
 */

const fs = require('fs');
const path = require('path');
const { parseStringPromise } = require('xml2js');

const BASE_URL = 'https://trueallyguide.com';
const BUILD_DIR = path.join(__dirname, '../build');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');

// Template for generating static HTML with correct canonical tag
function generateHTMLWithCanonical(url, title, description) {
  const canonicalUrl = url === BASE_URL ? `${BASE_URL}/` : url;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#000000" />
  <meta name="description" content="${description}" />
  <link rel="canonical" href="${canonicalUrl}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="website" />
  <title>${title}</title>
  <link href="/static/css/main.43dd6ae1.css" rel="stylesheet">
  <script>
    // Clean any legacy ?spa=1 parameter if present (no redirect loops)
    (function() {
      try {
        var href = window.location.href;
        if (href.indexOf('spa=1') !== -1) {
          var url = new URL(href);
          url.searchParams.delete('spa');
          var cleanUrl = url.pathname + (url.search || '') + (url.hash || '');
          
          if (window.history && window.history.replaceState) {
            window.history.replaceState(null, '', cleanUrl);
          }
        }
      } catch (e) {
        // Silent fallback - don't break the site
      }
    })();
  </script>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  <div id="root"></div>
  
  <script>
    // Load React bundle with error handling
    (function() {
      try {
        var script = document.createElement('script');
        script.src = '/static/js/main.2be25108.js';
        script.async = false;
        script.onerror = function() {
          document.getElementById('root').innerHTML = '<h1>Loading Error</h1><p>Please <a href="/">refresh the page</a>.</p>';
        };
        document.body.appendChild(script);
      } catch (e) {
        document.getElementById('root').innerHTML = '<h1>${title}</h1><p><a href="${canonicalUrl}">Continue to site</a></p>';
      }
    })();
  </script>
</body>
</html>`;
}

// Map route paths to page metadata
function getPageMetadata(path) {
  if (path === '/' || path === BASE_URL || path === `${BASE_URL}/`) {
    return {
      title: 'Quiet Strength – Self-Help & Productivity for Introverted Women',
      description: 'Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms.'
    };
  }
  
  if (path.includes('/blog/')) {
    const slug = path.split('/blog/')[1];
    const title = slug.replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return {
      title: `${title} | Quiet Strength`,
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
      title: `${title} Articles | Quiet Strength`,
      description: `Browse articles about ${title.toLowerCase()} for introverted women.`
    };
  }
  
  if (path.includes('/blog')) {
    return {
      title: 'Blog | Quiet Strength',
      description: 'Self-help articles and guides for introverted women seeking to build confidence and prevent burnout.'
    };
  }
  
  return {
    title: 'Quiet Strength',
    description: 'Self-help and productivity for introverted women.'
  };
}

async function generateStaticPages() {
  console.log('📝 Generating static pages with server-side canonical tags...');
  
  try {
    // Read sitemap to get all routes
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.log('⚠️  No sitemap found, creating basic static pages...');
      return;
    }
    
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const result = await parseStringPromise(sitemapContent);
    const urls = result.urlset.url.map(url => url.loc[0]);
    
    console.log(`📋 Found ${urls.length} URLs in sitemap`);
    
    // Generate static HTML for each route
    for (const url of urls) {
      const routePath = url.replace(BASE_URL, '') || '/';
      const metadata = getPageMetadata(url);
      const html = generateHTMLWithCanonical(url, metadata.title, metadata.description);
      
      // Determine output file path
      let outputPath;
      if (routePath === '/') {
        outputPath = path.join(BUILD_DIR, 'index.html');
      } else {
        const routeDir = path.join(BUILD_DIR, routePath);
        await fs.promises.mkdir(routeDir, { recursive: true });
        outputPath = path.join(routeDir, 'index.html');
      }
      
      // Write the static HTML file
      await fs.promises.writeFile(outputPath, html, 'utf8');
      
      console.log(`✅ Generated ${routePath} → ${path.relative(BUILD_DIR, outputPath)}`);
    }
    
    console.log(`🎉 Successfully generated ${urls.length} static pages`);
    
  } catch (error) {
    console.error('❌ Error generating static pages:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  generateStaticPages();
}

module.exports = { generateStaticPages };