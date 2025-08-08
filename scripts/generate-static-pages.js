#!/usr/bin/env node

/**
 * Enhanced static page generation with server-side canonical tags
 * Creates HTML files with correct canonical tags and proper bundle references
 * Ensures each route has the correct canonical URL without client-side JavaScript dependency
 */

const fs = require('fs');
const path = require('path');
const {
  getBlogPostMetadata: getEnhancedBlogPostMetadata,
  getCategoryMetadata,
  generateBlogPostSchema,
  generateCategorySchema,
  generateHomepageSchema,
  generateBlogListingSchema
} = require('./enhanced-metadata-extractor');

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

// Enhanced template for generating static HTML with comprehensive SEO and schema.org structured data
function generateHTMLWithMetadata(url, pageType, routeData, assets) {
  const canonicalUrl = url === BASE_URL ? `${BASE_URL}/` : url;
  const cssFile = assets.files['main.css'] || '/static/css/main.43dd6ae1.css';
  const jsFile = assets.files['main.js'] || '/static/js/main.32b1b242.js';
  
  let metadata, schema;
  
  // Get metadata and schema based on page type
  switch (pageType) {
    case 'homepage':
      metadata = {
        title: 'Quiet Strength – Self-Help & Productivity for Introverted Women',
        description: 'Actionable articles, e-books, and courses that help introverted women build confidence, prevent burnout, and thrive on their own terms.',
        image: `${BASE_URL}/images/logo.png`,
        ogType: 'website',
        keywords: ['self-help', 'introvert', 'confidence', 'personal development', 'women empowerment']
      };
      schema = generateHomepageSchema();
      break;
      
    case 'blog-listing':
      metadata = {
        title: 'Blog | Quiet Strength',
        description: 'Self-help articles and guides for introverted women seeking to build confidence and prevent burnout.',
        image: `${BASE_URL}/images/logo.png`,
        ogType: 'website',
        keywords: ['blog', 'self-help', 'introvert', 'articles']
      };
      schema = generateBlogListingSchema();
      break;
      
    case 'blog-post':
      const slug = routeData.slug;
      const postMetadata = getEnhancedBlogPostMetadata(slug);
      metadata = {
        title: `${postMetadata.title} | Quiet Strength`,
        description: postMetadata.description,
        image: postMetadata.image,
        ogType: 'article',
        keywords: postMetadata.keywords,
        datePublished: postMetadata.datePublished,
        dateModified: postMetadata.dateModified,
        author: postMetadata.author,
        category: postMetadata.category,
        readTime: postMetadata.readTime
      };
      schema = generateBlogPostSchema(canonicalUrl, postMetadata);
      break;
      
    case 'category':
      const categorySlug = routeData.categorySlug;
      const categoryMetadata = getCategoryMetadata(categorySlug);
      metadata = {
        title: `${categoryMetadata.name} Articles | Quiet Strength`,
        description: categoryMetadata.description,
        image: categoryMetadata.image,
        ogType: 'website',
        keywords: ['category', categoryMetadata.name.toLowerCase(), 'articles']
      };
      schema = generateCategorySchema(categoryMetadata);
      break;
      
    default:
      metadata = {
        title: 'Quiet Strength',
        description: 'Self-help and productivity for introverted women.',
        image: `${BASE_URL}/images/logo.png`,
        ogType: 'website',
        keywords: ['self-help', 'introvert']
      };
      schema = { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Quiet Strength', url: canonicalUrl };
  }
  
  // Generate structured data JSON
  const structuredData = Array.isArray(schema) ? schema : [schema];
  const jsonLdScript = structuredData.map(data => 
    `<script type="application/ld+json">${JSON.stringify(data, null, 0)}</script>`
  ).join('\n  ');
  
  // Generate article-specific meta tags for blog posts
  let articleMetaTags = '';
  if (pageType === 'blog-post' && metadata.datePublished) {
    articleMetaTags = `
  <!-- Article-specific meta tags -->
  <meta property="article:published_time" content="${metadata.datePublished}" />
  <meta property="article:modified_time" content="${metadata.dateModified}" />
  <meta property="article:author" content="${metadata.author.name}" />
  <meta property="article:section" content="${metadata.category}" />
  ${metadata.keywords.map(keyword => `<meta property="article:tag" content="${keyword}" />`).join('\n  ')}`;
  }
  
  // Generate keywords meta tag
  const keywordsTag = metadata.keywords ? `<meta name="keywords" content="${metadata.keywords.join(', ')}" />` : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <link rel="icon" href="/favicon.ico" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="theme-color" content="#C05621" />
  <meta name="author" content="Marica Šinko" />
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
  <meta name="description" content="${metadata.description}" />
  ${keywordsTag}
  
  <!-- Server-side canonical URL - Exact match to live URL -->
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Enhanced Open Graph tags -->
  <meta property="og:title" content="${metadata.title}" />
  <meta property="og:description" content="${metadata.description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="${metadata.ogType}" />
  <meta property="og:site_name" content="Quiet Strength" />
  <meta property="og:locale" content="en_US" />
  <meta property="og:image" content="${metadata.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="${metadata.title}" />
  <meta property="og:image:type" content="image/jpeg" />
  ${articleMetaTags}
  
  <!-- Enhanced Twitter Card tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@QuietStrengthGuide" />
  <meta name="twitter:creator" content="@MaricaSinko" />
  <meta name="twitter:title" content="${metadata.title}" />
  <meta name="twitter:description" content="${metadata.description}" />
  <meta name="twitter:url" content="${canonicalUrl}" />
  <meta name="twitter:image" content="${metadata.image}" />
  <meta name="twitter:image:alt" content="${metadata.title}" />
  
  <!-- Additional SEO meta tags -->
  <meta name="language" content="English" />
  <meta name="revisit-after" content="7 days" />
  <meta name="distribution" content="global" />
  <meta name="rating" content="general" />
  <meta name="application-name" content="Quiet Strength" />
  
  <title>${metadata.title}</title>
  <link href="${cssFile}" rel="stylesheet">
  
  <!-- Schema.org structured data for rich snippets -->
  ${jsonLdScript}
  
  <!-- Preload critical resources -->
  <link rel="preload" as="image" href="/images/logo.avif" type="image/avif">
  <link rel="preload" as="image" href="/images/logo.webp" type="image/webp">
  
  <!-- DNS prefetch for external resources -->
  <link rel="dns-prefetch" href="//trueallyguide.com">
  
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
        document.getElementById('root').innerHTML = '<h1>${metadata.title}</h1><p><a href="${canonicalUrl}">Continue to site</a></p>';
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

// Determine page type and route data for enhanced metadata generation
function getPageTypeAndData(url) {
  const path = url.replace(BASE_URL, '') || '/';
  
  if (path === '/') {
    return { pageType: 'homepage', routeData: {} };
  }
  
  if (path === '/blog') {
    return { pageType: 'blog-listing', routeData: {} };
  }
  
  if (path.includes('/blog/') && path !== '/blog') {
    const slug = path.split('/blog/')[1];
    return { pageType: 'blog-post', routeData: { slug } };
  }
  
  if (path.includes('/category/')) {
    const categorySlug = path.split('/category/')[1];
    return { pageType: 'category', routeData: { categorySlug } };
  }
  
  return { pageType: 'page', routeData: { path } };
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
    
    // Generate static HTML for each route with comprehensive SEO and schema.org
    for (const url of urls) {
      const routePath = url.replace(BASE_URL, '') || '/';
      const { pageType, routeData } = getPageTypeAndData(url);
      const html = generateHTMLWithMetadata(url, pageType, routeData, assets);
      
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
      
      console.log(`✅ Generated ${routePath} (${pageType}) → ${path.relative(BUILD_DIR, outputPath)}`);
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