#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to parse YAML frontmatter from markdown files
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return null;
  }

  const frontmatter = {};
  const lines = match[1].split('\n');
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    
    const key = line.substring(0, colonIndex).trim();
    let value = line.substring(colonIndex + 1).trim();
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) || 
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    
    frontmatter[key] = value;
  }
  
  return frontmatter;
}

// Function to read all markdown files from public directory
function readBlogPosts() {
  const publicDir = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicDir);
  const blogPosts = [];

  for (const file of files) {
    if (file.endsWith('.md') && file !== 'README.md') {
      const filePath = path.join(publicDir, file);
      const content = fs.readFileSync(filePath, 'utf8');
      const frontmatter = parseFrontmatter(content);
      
      if (frontmatter && frontmatter.slug) {
        blogPosts.push({
          slug: frontmatter.slug,
          title: frontmatter.title || 'Untitled',
          date: frontmatter.date || new Date().toISOString().split('T')[0],
          category: frontmatter.category || 'Uncategorized',
          lastmod: frontmatter.date || new Date().toISOString().split('T')[0]
        });
      }
    }
  }

  return blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Get unique categories from blog posts
function getCategories(blogPosts) {
  const categories = [...new Set(blogPosts.map(post => post.category))];
  return categories.filter(cat => cat && cat !== 'Uncategorized');
}

const baseUrl = 'https://trueallyguide.com';

function formatDate(dateString) {
  if (!dateString) return new Date().toISOString().split('T')[0];
  
  // Handle various date formats
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return new Date().toISOString().split('T')[0];
  }
  
  return date.toISOString().split('T')[0];
}

function generateSitemap() {
  console.log('📖 Reading blog posts from markdown files...');
  
  const blogPosts = readBlogPosts();
  const categories = getCategories(blogPosts);
  
  console.log(`Found ${blogPosts.length} blog posts`);
  console.log(`Found ${categories.length} categories: ${categories.join(', ')}`);

  const urls = [
    // Homepage
    {
      loc: baseUrl,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: '1.0'
    },
    // Blog listing page
    {
      loc: `${baseUrl}/blog`,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: '0.9'
    },
    // Category pages
    ...categories.map(category => ({
      loc: `${baseUrl}/category/${encodeURIComponent(category)}`,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: '0.8'
    })),
    // Individual blog posts
    ...blogPosts.map(post => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: formatDate(post.date),
      changefreq: 'monthly',
      priority: '0.7'
    }))
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap, 'utf8');
  
  console.log('✅ Sitemap generated successfully!');
  console.log(`📍 Location: ${sitemapPath}`);
  console.log(`🔗 Total URLs: ${urls.length}`);
  console.log('\nURLs included:');
  console.log('- Homepage');
  console.log('- Blog listing page');
  console.log(`- ${categories.length} category pages`);
  console.log(`- ${blogPosts.length} blog posts`);
  
  return {
    totalUrls: urls.length,
    blogPosts: blogPosts.length,
    categories: categories.length
  };
}

// Add function to validate sitemap
function validateSitemap() {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('❌ Sitemap not found. Run generation first.');
    return false;
  }

  const content = fs.readFileSync(sitemapPath, 'utf8');
  
  // Basic XML validation
  if (!content.includes('<?xml version="1.0" encoding="UTF-8"?>')) {
    console.error('❌ Invalid XML declaration');
    return false;
  }

  if (!content.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    console.error('❌ Invalid urlset declaration');
    return false;
  }

  const urlMatches = content.match(/<url>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  console.log('✅ Sitemap validation passed');
  console.log(`📊 Found ${urlCount} URLs in sitemap`);
  
  return true;
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
🗺️  Dynamic Sitemap Generator

Usage: node scripts/generate-sitemap-dynamic.js [options]

Options:
  --validate    Validate existing sitemap
  --help        Show this help message

This script automatically:
  ✅ Reads all .md files from the public/ directory
  ✅ Extracts metadata from YAML frontmatter
  ✅ Generates category pages dynamically
  ✅ Creates XML sitemap with proper formatting
  ✅ Includes all blog posts with correct dates

The sitemap includes:
  - Homepage (priority 1.0)
  - Blog listing page (priority 0.9)
  - Category pages (priority 0.8)
  - Individual blog posts (priority 0.7)
`);
    return;
  }

  if (args.includes('--validate')) {
    validateSitemap();
    return;
  }

  try {
    const result = generateSitemap();
    
    if (args.includes('--verbose')) {
      console.log('\n📋 Detailed Results:');
      console.log(JSON.stringify(result, null, 2));
    }
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateSitemap, validateSitemap, readBlogPosts };