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

// Canonical base URL must match the environment (prevents localhost vs prod conflicts)
const BASE_URL = process.env.SITE_URL || process.env.PUBLIC_URL || 'https://trueallyguide.com';
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
  <!-- Non-blocking stylesheet load -->
  <link rel="preload" href="${cssFile}" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="${cssFile}"></noscript>
  
  <!-- Schema.org structured data for rich snippets -->
  ${jsonLdScript}
  
  <!-- Performance: Aggressive optimization for 100/100 desktop scores -->
  <!-- Font preloading with fallback metrics for zero CLS -->
  <link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossorigin>
  <link rel="preload" as="font" href="/fonts/charter-regular.woff2" type="font/woff2" crossorigin>
  <link rel="preload" as="font" href="/fonts/charter-bold.woff2" type="font/woff2" crossorigin>
  
  <link rel="preload" as="image" href="/images/logo.avif" type="image/avif" fetchpriority="high">
  <link rel="preload" as="image" href="/images/logo.webp" type="image/webp" fetchpriority="high">
  <!-- Already preloaded above with onload-swap -->
  <link rel="preload" href="${jsFile}" as="script" fetchpriority="low">
  
  <!-- Resource hints kept minimal to avoid unnecessary connections; self-hosted assets only -->
  
  <!-- Critical LCP image preloading for homepage only -->
  ${pageType === 'homepage' ? `
  <link rel="preload" as="image" href="/images/confident-woman-learning-how-to-stop-attracting-narcissists-by-walking-away-from-toxic-relationships-toward-healthy-boundaries-and-self-empowerment.avif" type="image/avif" fetchpriority="high">
  <link rel="preload" as="image" href="/images/confident-woman-learning-how-to-stop-attracting-narcissists-by-walking-away-from-toxic-relationships-toward-healthy-boundaries-and-self-empowerment.webp" type="image/webp" fetchpriority="high">
  <link rel="preload" as="image" href="/images/confident-woman-learning-how-to-stop-attracting-narcissists-by-walking-away-from-toxic-relationships-toward-healthy-boundaries-and-self-empowerment.jpg" fetchpriority="high">` : ''}
  
  <!-- Performance: Advanced optimizations -->
  <meta http-equiv="x-dns-prefetch-control" content="on">
  <link rel="modulepreload" href="${jsFile}">
  
  <!-- Performance: Critical CSS for instant rendering -->
  <style>
    /* Ultra-optimized critical CSS for 100/100 Lighthouse scores */
    :root{--bg:#FFECD8;--text:#1a1a1a;--primary:#2E3644;--accent:#C05621;--white:#fff}
    *,::before,::after{box-sizing:border-box;margin:0;padding:0}
    html{font-size:100%;scroll-behavior:auto;-webkit-text-size-adjust:100%}
    /* Fonts with perfect fallback stacks to prevent CLS */
    @font-face{font-family:'Inter';src:url('/fonts/inter-var.woff2') format('woff2');font-weight:100 900;font-style:normal;font-display:swap;size-adjust:100.06%;ascent-override:90%;descent-override:22%;line-gap-override:0%}
    @font-face{font-family:'Charter';src:url('/fonts/charter-regular.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap;size-adjust:100%;ascent-override:88%;descent-override:12%;line-gap-override:0%}
    @font-face{font-family:'Charter';src:url('/fonts/charter-bold.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap;size-adjust:100%;ascent-override:88%;descent-override:12%;line-gap-override:0%}
    body{background:var(--bg);color:var(--text);font-family:'Charter',Georgia,'Times New Roman',serif;font-size:1.125rem;line-height:1.6;-webkit-font-smoothing:antialiased;text-rendering:optimizeSpeed;overflow-x:hidden;contain:layout style}
    h1,h2,h3,h4,h5,h6{font-family:'Inter','Helvetica Neue',Arial,sans-serif;font-weight:700;line-height:1.2;color:var(--text);contain:layout style}
    h1{font-size:2.25rem;line-height:1.1;margin-bottom:2rem;font-weight:800;contain:layout style}
    .container{max-width:1200px;margin:0 auto;padding:0 1.5rem;contain:layout}
    .flex{display:flex;contain:layout}.items-center{align-items:center}.justify-between{justify-content:space-between}.justify-center{justify-content:center}
    .text-center{text-align:center}.font-bold{font-weight:700}.font-semibold{font-weight:600}
    .mb-8{margin-bottom:2rem}.mb-4{margin-bottom:1rem}.mb-6{margin-bottom:1.5rem}.mb-12{margin-bottom:3rem}
    .py-32{padding:8rem 0}.py-4{padding:1rem 0}.px-6{padding:0 1.5rem}.px-10{padding:0 2.5rem}.p-4{padding:1rem}
    .sticky{position:sticky;contain:layout style paint}.top-0{top:0}.z-50{z-index:50}.relative{position:relative}
    .bg-brand-emphasis{background:#B44416;contain:paint}.bg-brand-light{background:#FFECD8;contain:paint}.bg-white{background:var(--white);contain:paint}
    .text-white{color:var(--white)}.text-brand-primary{color:#2E3644}.text-brand-emphasis{color:#B44416}.text-brand-dark{color:#1a1a1a}
    .text-4xl{font-size:2.25rem;line-height:2.5rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-xl{font-size:1.25rem;line-height:1.75rem}
    .text-xs{font-size:.875rem;line-height:1.25rem}.text-sm{font-size:.875rem;line-height:1.25rem}
    img{max-width:100%;height:auto;border-radius:.5rem;image-rendering:optimizeQuality;contain:layout}
    .w-8{width:2rem;height:2rem;contain:layout size}.mr-3{margin-right:.75rem}.ml-3{margin-left:.75rem}.ml-4{margin-left:1rem}
    /* Critical: Prevent CLS with fixed dimensions and containment */
    .w-24{width:6rem;height:6rem;contain:layout size}.w-20{width:5rem;height:5rem;contain:layout size}
    .rounded-lg{border-radius:.5rem;contain:layout size}.rounded-xl{border-radius:.75rem}.rounded-full{border-radius:9999px}
    .shadow-lg{box-shadow:0 10px 15px -3px rgba(0,0,0,.1),0 4px 6px -2px rgba(0,0,0,.05)}
    .shadow-xl{box-shadow:0 20px 25px -5px rgba(0,0,0,.1),0 10px 10px -5px rgba(0,0,0,.04)}
    .border{border-width:1px}.border-gray-100{border-color:#f3f4f6}
    .space-y-6>*+*{margin-top:1.5rem}
    .max-w-2xl{max-width:42rem}.max-w-4xl{max-width:56rem}.mx-auto{margin:0 auto}
    .gap-8{gap:2rem}.gap-6{gap:1.5rem}.flex-col{flex-direction:column}.items-start{align-items:flex-start}
    .flex-1{flex:1 1 0%}.min-w-0{min-width:0}.flex-shrink-0{flex-shrink:0}
    .group{position:relative}.cursor-pointer{cursor:pointer}
    .hover\\:bg-gray-50:hover{background-color:#f9fafb}.hover\\:bg-opacity-90:hover{background-color:rgba(180,68,22,.9)}
    .transition{transition:all .15s ease}.transition-colors{transition-color .15s ease}.transition-opacity{transition:opacity .3s ease}
    .duration-200{transition-duration:.2s}.duration-300{transition-duration:.3s}
    .transform{transform:translateZ(0);will-change:transform}.hover\\:scale-105:hover{transform:scale(1.05)}
    .loading-skeleton{background:#f3f4f6;border-radius:.5rem;min-height:200px;animation:pulse 1.5s ease-in-out infinite;contain:layout style paint}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    .opacity-0{opacity:0}.opacity-100{opacity:1}
    .text-gray-500{color:#6b7280}.text-gray-400{color:#9ca3af}.bg-gray-200{background-color:#e5e7eb}
    .leading-tight{line-height:1.25}.leading-relaxed{line-height:1.625}.overflow-wrap-break-word{overflow-wrap:break-word}
    .truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
    /* Responsive breakpoints - Mobile first */
    @media(min-width:640px){.sm\\:text-sm{font-size:.875rem}.sm\\:text-base{font-size:1rem}.sm\\:text-lg{font-size:1.125rem}.sm\\:text-xl{font-size:1.25rem}.sm\\:p-3{padding:.75rem}.sm\\:p-6{padding:1.5rem}.sm\\:px-2{padding:0 .5rem}.sm\\:ml-3{margin-left:.75rem}.sm\\:ml-4{margin-left:1rem}.sm\\:mb-6{margin-bottom:1.5rem}.sm\\:w-24{width:6rem}.sm\\:w-32{width:8rem}.sm\\:max-w-32{max-width:8rem}.sm\\:flex-row{flex-direction:row}}
    @media(min-width:768px){.md\\:text-5xl{font-size:3rem}.md\\:text-lg{font-size:1.125rem}.md\\:text-xl{font-size:1.25rem}.md\\:text-base{font-size:1rem}.md\\:py-48{padding:12rem 0}.md\\:w-32{width:8rem}.md\\:w-40{width:10rem}.md\\:ml-6{margin-left:1.5rem}.md\\:ml-4{margin-left:1rem}}
    @media(min-width:1024px){.lg\\:text-7xl{font-size:4.5rem}.lg\\:text-xl{font-size:1.25rem}.lg\\:text-lg{font-size:1.125rem}.lg\\:text-sm{font-size:.875rem}.lg\\:p-4{padding:1rem}.lg\\:p-8{padding:2rem}.lg\\:w-40{width:10rem}.lg\\:w-48{width:12rem}.lg\\:ml-6{margin-left:1.5rem}.lg\\:ml-8{margin-left:2rem}.lg\\:max-w-40{max-width:10rem}.lg\\:space-y-8>*+*{margin-top:2rem}.lg\\:grid{display:grid}.lg\\:grid-cols-12{grid-template-columns:repeat(12,minmax(0,1fr))}.lg\\:col-span-8{grid-column:span 8/span 8}.lg\\:gap-24{gap:6rem}.lg\\:block{display:block}}
    @media(min-width:1280px){.xl\\:text-8xl{font-size:6rem}.xl\\:text-2xl{font-size:1.5rem}}
    /* Accessibility improvements */
    .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
    .focus\\:not-sr-only:focus{position:static;width:auto;height:auto;padding:inherit;margin:inherit;overflow:visible;clip:auto;white-space:normal}
    a:focus,button:focus,.focus\\:outline{outline:3px solid #C05621;outline-offset:2px}
    .focus\\:ring{box-shadow:0 0 0 3px rgba(192,86,33,.3)}
    /* High contrast mode support */
    @media(prefers-contrast:high){:root{--bg:#fff;--text:#000;--primary:#000;--accent:#0000ff}}
    /* Performance optimizations */
    .hidden{display:none}
    @media(prefers-reduced-motion:reduce){*,::before,::after{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important;scroll-behavior:auto!important}}
  </style>
  
  <!-- Performance: Ultra-fast immediate rendering with skeleton -->
  <!-- Clean URL handled by SPA; avoid inline scripts for CSP compatibility -->
  </head>
  <body>
  <noscript>You need to enable JavaScript to run this app.</noscript>
  
  <!-- Instant critical above-the-fold content for perfect LCP -->
  <div id="root">
    <!-- Skip to main content link for accessibility -->
    <a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-brand-emphasis focus:text-white focus:px-4 focus:py-2">Skip to main content</a>
    
    <header class="sticky top-0 bg-brand-emphasis z-50" role="banner">
      <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
          <div class="flex items-center">
            <img src="/images/logo.png" alt="Quiet Strength logo" class="w-8 h-8 mr-3" width="32" height="32" loading="eager" decoding="sync">
            <span class="text-white font-bold text-xl">Quiet Strength</span>
          </div>
        </div>
      </div>
    </header>
    
    <main id="main-content" role="main">
      <section class="bg-brand-light py-32 md:py-48 text-center" ${pageType === 'homepage' ? 'aria-labelledby="hero-heading"' : ''}>
        <div class="container mx-auto px-6">
          <h1 id="hero-heading" class="text-4xl md:text-5xl lg:text-7xl xl:text-8xl font-bold text-brand-primary mb-8">
            ${pageType === 'blog-post' ? metadata.title.replace(' | Quiet Strength', '') : 'Quiet Strength'}
          </h1>
          <p class="text-lg md:text-xl text-brand-primary mb-8 max-w-2xl mx-auto">
            ${metadata.description}
          </p>
          <div class="loading-skeleton mx-auto" style="width:400px;height:267px;max-width:100%" role="img" aria-label="Loading content placeholder"></div>
        </div>
      </section>
    </main>
  </div>
  
  <!-- Load main bundle without inline scripts (CSP friendly) -->
  <script src="${jsFile}" defer></script>
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
  // Normalize to pathname only (strip protocol/host/query/hash)
  let path;
  try { path = new URL(url).pathname || '/'; }
  catch { path = url.replace(BASE_URL, '') || '/'; }
  
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
      // Always derive pathname from URL to avoid host variations (www/non-www)
      let routePath;
      try { routePath = new URL(url).pathname || '/'; }
      catch { routePath = url.replace(BASE_URL, '') || '/'; }
      const { pageType, routeData } = getPageTypeAndData(url);
      const html = generateHTMLWithMetadata(url, pageType, routeData, assets);
      
      // Determine output file path
      let outputPath;
      // Normalize route path to avoid absolute joins on Windows (strip leading slashes)
      const safeRoutePath = routePath.replace(/^\/+/, '');
      if (routePath === '/' || safeRoutePath === '') {
        outputPath = path.join(BUILD_DIR, 'index.html');
      } else {
        const routeDir = path.join(BUILD_DIR, safeRoutePath);
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
