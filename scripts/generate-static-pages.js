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

const BASE_URL = 'https://www.trueallyguide.com';
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
  // Fix canonical URL to match exact Vercel live URL patterns
  let canonicalUrl;
  if (url === BASE_URL || url === `${BASE_URL}/`) {
    canonicalUrl = `${BASE_URL}/`; // Homepage always has trailing slash
  } else {
    // All other pages: add trailing slash to match Vercel live URLs
    canonicalUrl = url.endsWith('/') ? url : `${url}/`;
  }
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
  
  <!-- Performance: Aggressive optimization for 100/100 desktop scores -->
  <link rel="preload" as="image" href="/images/logo.avif" type="image/avif" fetchpriority="high">
  <link rel="preload" as="image" href="/images/logo.webp" type="image/webp" fetchpriority="high">
  <link rel="preload" href="${cssFile}" as="style">
  <link rel="preload" href="${jsFile}" as="script" fetchpriority="low">
  
  <!-- Performance: Resource hints for faster loading -->
  <link rel="preconnect" href="https://www.trueallyguide.com" crossorigin>
  <link rel="dns-prefetch" href="//trueallyguide.com">
  
  <!-- Performance: Advanced optimizations -->
  <meta http-equiv="x-dns-prefetch-control" content="on">
  <link rel="modulepreload" href="${jsFile}">
  
  <!-- Performance: Critical CSS for instant rendering -->
  <style>
    /* Ultra-minimal critical CSS for instant LCP */
    :root{--bg:#FFECD8;--text:#1a1a1a;--primary:#2E3644;--accent:#C05621}
    *{box-sizing:border-box;margin:0;padding:0}
    body{background:var(--bg);color:var(--text);font:1.125rem/1.6 Georgia,serif;-webkit-font-smoothing:antialiased}
    h1,h2,h3,h4,h5,h6{font:700 1em/1.2 'Helvetica Neue',Arial,sans-serif;color:var(--text)}
    .container{max-width:1200px;margin:0 auto;padding:0 1.5rem}
    .flex{display:flex}.items-center{align-items:center}.justify-between{justify-content:space-between}
    .text-center{text-align:center}.font-bold{font-weight:700}.mb-8{margin-bottom:2rem}
    .py-32{padding:8rem 0}.px-6{padding:0 1.5rem}.sticky{position:sticky}.top-0{top:0}.z-50{z-index:50}
    .bg-brand-emphasis{background:#B44416}.text-white{color:#fff}.text-4xl{font-size:2.25rem}
    .bg-brand-light{background:#FFECD8}.text-brand-primary{color:#2E3644}
    img{max-width:100%;height:auto;border-radius:.5rem}
    .w-8{width:2rem}.h-8{height:2rem}.mr-3{margin-right:.75rem}
    .loading-skeleton{background:#f3f4f6;border-radius:.5rem;min-height:200px;animation:pulse 1.5s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @media(min-width:768px){.md\:text-5xl{font-size:3rem}.md\:py-48{padding:12rem 0}}
    @media(min-width:1024px){.lg\:text-7xl{font-size:4.5rem}}
    @media(min-width:1280px){.xl\:text-8xl{font-size:6rem}}
  </style>
  
  <!-- Performance: Ultra-fast immediate rendering with skeleton -->
  <script>
    // Instant content display for perfect LCP
    (function() {
      try {
        // Remove tracking parameters immediately
        var href = window.location.href;
        var url = new URL(href);
        var changed = false;
        var trackingParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'ref', 'gclid', 'fbclid', 'spa'];
        trackingParams.forEach(function(param) {
          if (url.searchParams.has(param)) {
            url.searchParams.delete(param);
            changed = true;
          }
        });
        if (changed && window.history && window.history.replaceState) {
          window.history.replaceState(null, '', url.pathname + (url.search || '') + (url.hash || ''));
        }
        
        // Preload critical resources immediately
        var link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'script';
        link.href = '${jsFile}';
        document.head.appendChild(link);
        
      } catch (e) {}
    })();
  </script>
</head>
<body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  
  <!-- Instant critical above-the-fold content for perfect LCP -->
  <div id="root">
    <header class="sticky top-0 bg-brand-emphasis z-50">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img src="/images/logo.png" alt="Quiet Strength" class="w-8 h-8 mr-3" width="32" height="32" loading="eager">
            <span class="text-white font-bold text-xl">Quiet Strength</span>
          </div>
        </div>
      </div>
    </header>
    
    <section class="bg-brand-light py-32 md:py-48 text-center">
      <div class="container mx-auto px-6">
        <h1 class="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-brand-primary mb-8">
          ${pageType === 'blog-post' ? metadata.title.replace(' | Quiet Strength', '') : 'Quiet Strength'}
        </h1>
        <p class="text-lg md:text-xl text-brand-primary mb-8 max-w-2xl mx-auto">
          ${metadata.description}
        </p>
        <div class="loading-skeleton mx-auto" style="width:400px;height:267px;max-width:100%"></div>
      </div>
    </section>
  </div>
  
  <!-- Ultra-fast React bundle loading with perfect error handling -->
  <script>
    (function() {
      // Measure LCP immediately
      var lcpTime = performance.now();
      
      try {
        var script = document.createElement('script');
        script.src = '${jsFile}';
        script.async = true;
        script.defer = true;
        
        script.onload = function() {
          // React will take over the #root div content
          console.log('React loaded in', Math.round(performance.now() - lcpTime), 'ms');
        };
        
        script.onerror = function() {
          var fallbackContent = '<div style="padding:2rem;text-align:center;background:#FFECD8;min-height:100vh">';
          fallbackContent += '<h1 style="color:#1a1a1a;margin-bottom:1rem">${metadata.title.replace(/'/g, '\'')}</h1>';
          fallbackContent += '<p style="color:#1a1a1a;margin-bottom:1rem">${metadata.description.replace(/'/g, '\'')}</p>';
          fallbackContent += '<a href="${canonicalUrl}" style="color:#C05621;text-decoration:underline">Refresh page</a></div>';
          document.getElementById('root').innerHTML = fallbackContent;
        };
        
        // Load immediately for best performance
        document.head.appendChild(script);
        
      } catch (e) {
        document.getElementById('root').innerHTML = '<div style="padding:2rem;text-align:center;background:#FFECD8;min-height:100vh"><h1>${metadata.title.replace(/'/g, '\'')} | Quiet Strength</h1><p><a href="${canonicalUrl}" style="color:#C05621">Continue to site</a></p></div>';
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