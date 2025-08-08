#!/usr/bin/env node

/**
 * Enhanced static page generation with server-side canonical tags
 * Creates HTML files with correct canonical tags and proper bundle references
 * Ensures each route has the correct canonical URL without client-side JavaScript dependency
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://trueallyguide.com';
const BUILD_DIR = path.join(__dirname, '../build');
const SITEMAP_PATH = path.join(__dirname, '../public/sitemap.xml');
const ASSET_MANIFEST_PATH = path.join(BUILD_DIR, 'asset-manifest.json');

// Read asset manifest to get correct bundle filenames
function getAssetManifest() {
  try {
    if (fs.existsSync(ASSET_MANIFEST_PATH)) {
      const manifest = JSON.parse(fs.readFileSync(ASSET_MANIFEST_PATH, 'utf8'));
      return manifest;
    }
  } catch (error) {
    console.warn('⚠️  Could not read asset manifest, using fallback bundles');
  }
  return {
    'main.css': '/static/css/main.43dd6ae1.css',
    'main.js': '/static/js/main.32b1b242.js'
  };
}

// Enhanced template for generating static HTML with correct canonical tag and dynamic bundles
function generateHTMLWithCanonical(url, title, description, assets) {
  const canonicalUrl = url === BASE_URL ? `${BASE_URL}/` : url;
  const cssFile = assets.files['main.css'] || '/static/css/main.43dd6ae1.css';
  const jsFile = assets.files['main.js'] || '/static/js/main.32b1b242.js';
  
  // Determine content type for better meta tags
  const isArticle = url.includes('/blog/') && url !== `${BASE_URL}/blog`;
  const ogType = isArticle ? 'article' : 'website';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#C05621" />
  <meta name="author" content="Marica Šinko" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="description" content="${description}" />
  
  <!-- Server-side canonical URL - NO hardcoding, route-specific -->
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Enhanced Open Graph tags -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Quiet Strength" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="https://trueallyguide.com/images/logo.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${title}" />
  
  <!-- Enhanced Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@QuietStrengthGuide" />
  <meta name="twitter:creator" content="@MaricaSinko" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:image" content="https://trueallyguide.com/images/logo.png" />
  <meta name="twitter:image:alt" content="${title}" />
  
  <title>${title}</title>
  <link href="${cssFile}" rel="stylesheet">
  
  <!-- Client-side URL cleanup (remove tracking params) -->
  <script>
    (function() {
      try {
        var href = window.location.href;
        var url = new URL(href);
        var changed = false;
        
        // Remove tracking parameters
        var trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'gclid', 'fbclid', 'spa'];
        trackingParams.forEach(function(param) {
          if (url.searchParams.has(param)) {
            url.searchParams.delete(param);
            changed = true;
          }
        });
        
        // Update URL if tracking params were removed
        if (changed && window.history && window.history.replaceState) {
          var cleanUrl = url.pathname + (url.search || '') + (url.hash || '');
          window.history.replaceState(null, '', cleanUrl);
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
        script.src = '${jsFile}';
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

// Get blog post metadata from markdown files
function getBlogPostMetadata(slug) {
  const blogDataPath = path.join(__dirname, '../src/blogData.js');
  try {
    // Read blog data to get post info
    if (fs.existsSync(blogDataPath)) {
      const blogDataContent = fs.readFileSync(blogDataPath, 'utf8');
      
      // Extract blog post data (simple regex parsing for blog posts)
      const titleMatch = blogDataContent.match(new RegExp(`slug:\\s*['"]${slug}['"][\\s\\S]*?title:\\s*['"]([^'"]+)['"]`));
      const descriptionMatch = blogDataContent.match(new RegExp(`slug:\\s*['"]${slug}['"][\\s\\S]*?description:\\s*['"]([^'"]+)['"]`));
      
      if (titleMatch && descriptionMatch) {
        return {
          title: `${titleMatch[1]} | Quiet Strength`,
          description: descriptionMatch[1]
        };
      }
    }
    
    // Fallback: check for markdown file in public directory
    const publicMdFiles = fs.readdirSync(path.join(__dirname, '../public')).filter(f => f.endsWith('.md'));
    for (const file of publicMdFiles) {
      const content = fs.readFileSync(path.join(__dirname, '../public', file), 'utf8');
      if (content.includes(`slug: "${slug}"`)) {
        const titleMatch = content.match(/title:\s*"([^"]+)"/);
        const descriptionMatch = content.match(/description:\s*"([^"]+)"/);
        if (titleMatch && descriptionMatch) {
          return {
            title: `${titleMatch[1]} | Quiet Strength`,
            description: descriptionMatch[1]
          };
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not read metadata for blog post: ${slug}`);
  }
  
  // Final fallback
  const title = slug.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  return {
    title: `${title} | Quiet Strength`,
    description: `Learn about ${title.toLowerCase()} and build quiet confidence as an introverted woman.`
  };
}

// Map route paths to page metadata
function getPageMetadata(path) {
  if (path === '/' || path === BASE_URL || path === `${BASE_URL}/`) {
    return {
      title: 'Quiet Strength – Self-Help & Productivity for Introverted Women',
      description: 'Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms.'
    };
  }
  
  if (path.includes('/blog/') && path !== `${BASE_URL}/blog`) {
    const slug = path.split('/blog/')[1];
    return getBlogPostMetadata(slug);
  }
  
  if (path.includes('/category/')) {
    const category = path.split('/category/')[1];
    const title = category.replace(/-/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    return {
      title: `${title} Articles | Quiet Strength`,
      description: `Browse articles about ${title.toLowerCase()} for introverted women seeking confidence and personal growth.`
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
    // Get asset manifest for correct bundle filenames
    const assets = getAssetManifest();
    console.log('📦 Using bundles:', assets.files ? Object.keys(assets.files).filter(k => k.includes('main')) : 'fallback');
    
    // Read sitemap to get all routes
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.log('⚠️  No sitemap found, creating basic static pages...');
      return;
    }
    
    // Parse sitemap
    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf8');
    const sitemapXmlMatch = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    const urls = sitemapXmlMatch ? sitemapXmlMatch.map(match => match.replace(/<\/?loc>/g, '')) : [];
    
    if (urls.length === 0) {
      console.log('⚠️  No URLs found in sitemap');
      return;
    }
    
    console.log(`📋 Found ${urls.length} URLs in sitemap`);
    
    // Generate static HTML for each route
    for (const url of urls) {
      const routePath = url.replace(BASE_URL, '') || '/';
      const metadata = getPageMetadata(url);
      const html = generateHTMLWithCanonical(url, metadata.title, metadata.description, assets);
      
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
    
    console.log(`🎉 Successfully generated ${urls.length} static pages with server-side canonical URLs`);
    
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