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

// Function to extract metadata from content without frontmatter
function extractContentMetadata(content, filename) {
  const lines = content.split('\n').filter(line => line.trim());
  let title = '';
  let date = '';
  
  // Try to extract title from first non-empty line
  if (lines.length > 0) {
    title = lines[0].replace(/^#+\s*/, '').trim();
  }
  
  // Try to find date in the first few lines
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    const dateMatch = line.match(/(?:Last updated:|Date:|Published:)?\s*(\d{4}-\d{2}-\d{2})/i);
    if (dateMatch) {
      date = dateMatch[1];
      break;
    }
  }
  
  // If no date found, use file modification time
  if (!date) {
    const publicDir = path.join(__dirname, '..', 'public');
    const fileStats = fs.statSync(path.join(publicDir, filename));
    date = fileStats.mtime.toISOString().split('T')[0];
  }
  
  // Generate slug from filename or title
  let slug = filename.replace('.md', '');
  if (slug.match(/^(First|Second|Third|Fourth|Fifth|Sixth|Seventh|Eigth|Ninth|Tenth|Eleventh|Twelvth|13th)Blog$/i)) {
    // For numbered blogs, create slug from title if available
    if (title) {
      slug = title.toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    }
  }
  
  return { title, date, slug };
}

// Function to read blog posts from blogData.js
function readBlogPosts() {
  console.log('📖 Reading blog posts from blogData.js...');
  
  try {
    // Import the blog data from the source
    const blogDataPath = path.join(__dirname, '..', 'src', 'blogData.js');
    
    // Read the file content and extract the blogPosts array
    const content = fs.readFileSync(blogDataPath, 'utf8');
    
    // This is a simple approach - in a real scenario you might want to use a proper module loader
    // For now, we'll parse the exported data manually
    const blogPosts = [];
    
    // Extract blog post data from the JavaScript file
    const postMatches = content.match(/\{\s*slug:\s*['"`]([^'"`]+)['"`][\s\S]*?readTime:\s*['"`][^'"`]+['"`],?\s*\}/g);
    
    if (postMatches) {
      postMatches.forEach((match, index) => {
        try {
          const slugMatch = match.match(/slug:\s*['"`]([^'"`]+)['"`]/);
          const titleMatch = match.match(/title:\s*['"`]([^'"`]+)['"`]/);
          const dateMatch = match.match(/date:\s*['"`]([^'"`]+)['"`]/);
          const categoryMatch = match.match(/category:\s*categories\.([A-Z_]+)/);
          
          // Map category constants to their display names
          const categoryMap = {
            'INTROVERSION_PERSONALITY': 'Introversion & Personality',
            'RELATIONSHIPS_DATING': 'Relationships & Dating',
            'CAREER_WORKPLACE': 'Career & Workplace',
            'SELF_DEVELOPMENT': 'Self-Development',
            'WOMENS_WELLNESS': 'Women\'s Wellness'
          };

          // Category slug mapping for clean URLs
          const categorySlugMap = {
            'Introversion & Personality': 'introversion-and-personality',
            'Relationships & Dating': 'relationships-and-dating',
            'Career & Workplace': 'career-and-workplace',
            'Self-Development': 'self-development',
            'Women\'s Wellness': 'womens-wellness',
          };
          
          if (slugMatch && titleMatch && dateMatch) {
            const blogPost = {
              slug: slugMatch[1],
              title: titleMatch[1],
              date: dateMatch[1],
              category: categoryMatch ? categoryMap[categoryMatch[1]] || 'Self-Development' : 'Self-Development',
              lastmod: dateMatch[1]
            };
            
            blogPosts.push(blogPost);
            console.log(`✅ React Component: ${blogPost.title} -> ${blogPost.slug}`);
          }
        } catch (error) {
          console.error(`❌ Error parsing blog post ${index + 1}:`, error.message);
        }
      });
    }
    
    console.log(`Found ${blogPosts.length} blog posts from React components`);
    return blogPosts;
    
  } catch (error) {
    console.error('❌ Error reading blogData.js:', error.message);
    console.log('📝 Falling back to markdown file scanning...');
    
    // Fallback to the original markdown scanning method
    return readBlogPostsFromMarkdown();
  }
}

// Fallback function to read from markdown files (original implementation)
function readBlogPostsFromMarkdown() {
  const publicDir = path.join(__dirname, '..', 'public');
  const files = fs.readdirSync(publicDir);
  const blogPosts = [];

  console.log(`🔍 Scanning ${files.filter(f => f.endsWith('.md')).length} markdown files...`);

  for (const file of files) {
    if (file.endsWith('.md') && 
        file !== 'README.md' && 
        file !== 'BLOG_STRUCTURE_REQUIREMENTS.md') {
      
      try {
        const filePath = path.join(publicDir, file);
        const content = fs.readFileSync(filePath, 'utf8');
        const frontmatter = parseFrontmatter(content);
        
        let blogPost;
        
        if (frontmatter && frontmatter.slug) {
          // Use frontmatter data
          blogPost = {
            slug: frontmatter.slug,
            title: frontmatter.title || 'Untitled',
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            category: frontmatter.category || 'Self-Development',
            lastmod: frontmatter.date || new Date().toISOString().split('T')[0],
            filename: file
          };
          console.log(`✅ Frontmatter: ${file} -> ${blogPost.slug}`);
        } else {
          // Extract from content
          const extracted = extractContentMetadata(content, file);
          blogPost = {
            slug: extracted.slug,
            title: extracted.title || file.replace('.md', ''),
            date: extracted.date,
            category: 'Self-Development', // Default category
            lastmod: extracted.date,
            filename: file
          };
          console.log(`📝 Content: ${file} -> ${blogPost.slug}`);
        }
        
        blogPosts.push(blogPost);
        
      } catch (error) {
        console.error(`❌ Error processing ${file}:`, error.message);
      }
    }
  }

  // Remove duplicates based on slug (keep the most recent one)
  const uniquePosts = [];
  const seenSlugs = new Set();
  
  const sortedPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  for (const post of sortedPosts) {
    if (!seenSlugs.has(post.slug)) {
      seenSlugs.add(post.slug);
      uniquePosts.push(post);
    } else {
      console.log(`🔄 Duplicate slug removed: ${post.filename} (${post.slug})`);
    }
  }

  return uniquePosts;
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

  // Category slug mapping for clean URLs
  const categorySlugMap = {
    'Introversion & Personality': 'introversion-and-personality',
    'Relationships & Dating': 'relationships-and-dating',
    'Career & Workplace': 'career-and-workplace',
    'Self-Development': 'self-development',
    'Women\'s Wellness': 'womens-wellness',
  };

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
      loc: `${baseUrl}/category/${categorySlugMap[category] || category.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')}`,
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