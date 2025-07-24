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

// Function to create or update RSS feed
function updateRSSFeed(options) {
  const { title, slug, date, category, description, author } = options;
  const rssPath = path.join(__dirname, '..', 'public', 'rss.xml');
  
  const pubDate = new Date(date).toUTCString();
  const link = `https://trueallyguide.com/blog/${slug}`;
  
  // Create new RSS item
  const newItem = `    <item>
      <title><![CDATA[${title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${description}]]></description>
      <category><![CDATA[${category}]]></category>
      <author>noreply@trueallyguide.com (${author})</author>
      <pubDate>${pubDate}</pubDate>
    </item>`;

  if (fs.existsSync(rssPath)) {
    // Update existing RSS feed
    let rss = fs.readFileSync(rssPath, 'utf8');
    
    // Update lastBuildDate
    const currentDate = new Date().toUTCString();
    rss = rss.replace(/<lastBuildDate>.*?<\/lastBuildDate>/, `<lastBuildDate>${currentDate}</lastBuildDate>`);
    
    // Add new item after opening <channel> tag and existing items
    rss = rss.replace(/(<channel>[\s\S]*?)(\s*<\/channel>)/, `$1${newItem}\n$2`);
    
    fs.writeFileSync(rssPath, rss);
    console.log(`✅ Updated RSS feed with new blog post: ${slug}`);
  } else {
    // Create new RSS feed
    const currentDate = new Date().toUTCString();
    const rssContent = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Quiet Strength Blog</title>
    <link>https://trueallyguide.com</link>
    <description>Self-help and productivity content for introverted women. Build confidence, manage energy, and achieve your goals on your own terms.</description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="https://trueallyguide.com/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>https://trueallyguide.com/images/logo.png</url>
      <title>Quiet Strength Blog</title>
      <link>https://trueallyguide.com</link>
    </image>
${newItem}
  </channel>
</rss>`;
    
    fs.writeFileSync(rssPath, rssContent);
    console.log(`✅ Created RSS feed with new blog post: ${slug}`);
  }
}

// Function to create or update Atom feed
function updateAtomFeed(options) {
  const { title, slug, date, category, description, author } = options;
  const atomPath = path.join(__dirname, '..', 'public', 'atom.xml');
  
  const isoDate = new Date(date).toISOString();
  const link = `https://trueallyguide.com/blog/${slug}`;
  
  // Create new Atom entry
  const newEntry = `  <entry>
    <title type="html"><![CDATA[${title}]]></title>
    <link href="${link}"/>
    <id>${link}</id>
    <published>${isoDate}</published>
    <updated>${isoDate}</updated>
    <summary type="html"><![CDATA[${description}]]></summary>
    <category term="${category}"/>
    <author>
      <name>${author}</name>
    </author>
  </entry>`;

  if (fs.existsSync(atomPath)) {
    // Update existing Atom feed
    let atom = fs.readFileSync(atomPath, 'utf8');
    
    // Update updated date
    const currentDate = new Date().toISOString();
    atom = atom.replace(/<updated>.*?<\/updated>/, `<updated>${currentDate}</updated>`);
    
    // Add new entry after feed opening tag
    atom = atom.replace(/(<feed[^>]*>[\s\S]*?)(\s*<\/feed>)/, `$1${newEntry}\n$2`);
    
    fs.writeFileSync(atomPath, atom);
    console.log(`✅ Updated Atom feed with new blog post: ${slug}`);
  } else {
    // Create new Atom feed
    const currentDate = new Date().toISOString();
    const atomContent = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Quiet Strength Blog</title>
  <link href="https://trueallyguide.com"/>
  <link href="https://trueallyguide.com/atom.xml" rel="self"/>
  <id>https://trueallyguide.com</id>
  <updated>${currentDate}</updated>
  <subtitle>Self-help and productivity content for introverted women. Build confidence, manage energy, and achieve your goals on your own terms.</subtitle>
  <author>
    <name>Marica Šinko</name>
    <email>noreply@trueallyguide.com</email>
  </author>
${newEntry}
</feed>`;
    
    fs.writeFileSync(atomPath, atomContent);
    console.log(`✅ Created Atom feed with new blog post: ${slug}`);
  }
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
  
  // Update RSS and Atom feeds
  const feedOptions = { ...options, slug, date };
  updateRSSFeed(feedOptions);
  updateAtomFeed(feedOptions);
  
  console.log(`\n🎉 Blog post created successfully!`);
  console.log(`📄 Generated files:`);
  console.log(`   - ${outputPath}`);
  console.log(`   - Updated sitemap.xml`);
  console.log(`   - Updated/created rss.xml`);
  console.log(`   - Updated/created atom.xml`);
  console.log(`\n🔗 URLs:`);
  console.log(`   - Blog: https://trueallyguide.com/blog/${slug}`);
  console.log(`   - Sitemap: https://trueallyguide.com/sitemap.xml`);
  console.log(`   - RSS: https://trueallyguide.com/rss.xml`);
  console.log(`   - Atom: https://trueallyguide.com/atom.xml`);
  console.log(`\nNext steps:`);
  console.log(`1. Add the blog post to src/blogData.js`);
  console.log(`2. Create a React component if needed`);
  console.log(`3. Test the blog post locally`);
  console.log(`4. Deploy your changes`);
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { createBlogPost, updateSitemap, updateRSSFeed, updateAtomFeed };