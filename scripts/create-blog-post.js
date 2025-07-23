#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Function to create slug from title
function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

// Function to get current date in YYYY-MM-DD format
function getCurrentDate() {
  return new Date().toISOString().split('T')[0];
}

// Function to estimate reading time (assuming 200 words per minute)
function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Function to create blog post template
function createBlogPost(options) {
  const {
    title,
    category,
    description,
    content,
    author = "Marica Šinko",
    image = "/images/default-blog-image.jpg",
    keywords = []
  } = options;

  const slug = createSlug(title);
  const date = getCurrentDate();
  const canonical = `https://trueallyguide.com/blog/${slug}`;
  const readTime = estimateReadingTime(content);

  const blogPost = `---
title: "${title}"
slug: "${slug}"
date: "${date}"
category: "${category}"
description: "${description}"
canonical: "${canonical}"
readTime: "${readTime}"
image: "${image}"
author: "${author}"
keywords: [${keywords.map(k => `"${k}"`).join(', ')}]
---

${content}
`;

  return { blogPost, slug, date };
}

// Function to update sitemap
function updateSitemap(slug, date) {
  const sitemapPath = path.join(__dirname, '..', 'public', 'sitemap.xml');
  
  if (!fs.existsSync(sitemapPath)) {
    console.error('Sitemap not found. Please run generate-sitemap.js first.');
    return;
  }

  let sitemap = fs.readFileSync(sitemapPath, 'utf8');
  
  // Create new URL entry
  const newEntry = `  <url>
    <loc>https://trueallyguide.com/blog/${slug}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  // Insert before closing </urlset> tag
  sitemap = sitemap.replace('</urlset>', `${newEntry}\n</urlset>`);
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log(`✅ Updated sitemap.xml with new blog post: ${slug}`);
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args.includes('--help')) {
    console.log(`
🚀 Blog Post Creator

Usage: node scripts/create-blog-post.js [options]

Options:
  --title "Your Blog Title"       Blog post title (required)
  --category "Category Name"      Blog category (required)
  --description "Description"     Meta description (required)  
  --content "Blog content"        Blog post content (required)
  --author "Author Name"          Author name (default: "Marica Šinko")
  --image "/path/to/image.jpg"    Featured image path (default: "/images/default-blog-image.jpg")
  --keywords "word1,word2,word3"  SEO keywords (comma-separated)
  --file blog-content.md          Read content from file instead of --content
  --help                          Show this help message

Categories:
  - "Introversion & Personality"
  - "Relationships & Dating"
  - "Career & Workplace"
  - "Self-Development"
  - "Women's Wellness"

Example:
  node scripts/create-blog-post.js \\
    --title "How to Build Confidence as an Introvert" \\
    --category "Self-Development" \\
    --description "Learn proven strategies to build lasting confidence as an introvert woman." \\
    --content "Your blog content here..." \\
    --keywords "confidence,introvert,self-development"
`);
    return;
  }

  // Parse arguments
  const options = {};
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    options[key] = value;
  }

  // Validate required fields
  const required = ['title', 'category', 'description'];
  const missing = required.filter(field => !options[field]);
  
  if (missing.length > 0) {
    console.error(`❌ Missing required fields: ${missing.join(', ')}`);
    console.log('Use --help for usage information.');
    return;
  }

  // Handle content from file
  if (options.file) {
    const filePath = path.resolve(options.file);
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Content file not found: ${filePath}`);
      return;
    }
    options.content = fs.readFileSync(filePath, 'utf8');
  }

  if (!options.content) {
    console.error('❌ Content is required. Use --content or --file option.');
    return;
  }

  // Parse keywords
  if (options.keywords) {
    options.keywords = options.keywords.split(',').map(k => k.trim());
  }

  // Create blog post
  const { blogPost, slug, date } = createBlogPost(options);
  
  // Write to file
  const outputPath = path.join(__dirname, '..', 'public', `${slug}.md`);
  fs.writeFileSync(outputPath, blogPost);
  
  console.log(`✅ Created blog post: ${outputPath}`);
  console.log(`📝 Slug: ${slug}`);
  console.log(`📅 Date: ${date}`);
  console.log(`🔗 URL: https://trueallyguide.com/blog/${slug}`);
  
  // Update sitemap
  updateSitemap(slug, date);
  
  console.log(`\n🎉 Blog post created successfully!`);
  console.log(`Next steps:`);
  console.log(`1. Add the blog post to src/blogData.js`);
  console.log(`2. Create a React component if needed`);
  console.log(`3. Test the blog post locally`);
  console.log(`4. Deploy your changes`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createBlogPost, updateSitemap };