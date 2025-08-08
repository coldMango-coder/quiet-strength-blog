#!/usr/bin/env node

/**
 * SEO Frontmatter Generator for Blog Posts
 * Automatically generates complete SEO frontmatter for new blog posts
 * Usage: node scripts/generate-seo-frontmatter.js "Blog Post Title" "Description" "/images/blog-image.jpg"
 */

const fs = require('fs');
const path = require('path');

// Configuration
const BASE_URL = 'https://trueallyguide.com';
const AUTHOR = 'Marica Šinko';
const DEFAULT_CATEGORY = 'Self-Development';

/**
 * Generates a URL-friendly slug from a title
 */
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim('-'); // Remove leading/trailing hyphens
}

/**
 * Estimates reading time based on content length
 */
function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Generates complete SEO frontmatter
 */
function generateSEOFrontmatter(title, description, image, category = DEFAULT_CATEGORY, keywords = []) {
  const slug = generateSlug(title);
  const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
  const canonical = `${BASE_URL}/blog/${slug}`;
  
  // Generate OG/Twitter variations
  const ogTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const twitterTitle = title.length > 70 ? title.substring(0, 67) + '...' : title;
  const ogDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const twitterDescription = description.length > 125 ? description.substring(0, 122) + '...' : description;

  return `---
title: "${title}"
slug: "${slug}"
date: "${currentDate}"
datePublished: "${currentDate}"
dateModified: "${currentDate}"
category: "${category}"
description: "${description}"
canonical: "${canonical}"
readTime: "8 min read"
image: "${image}"
author: "${AUTHOR}"
keywords: [${keywords.map(k => `"${k}"`).join(', ')}]
ogTitle: "${ogTitle}"
ogDescription: "${ogDescription}"
ogImage: "${image}"
twitterTitle: "${twitterTitle}"
twitterDescription: "${twitterDescription}"
twitterImage: "${image}"
---`;
}

/**
 * Creates a new blog post file with SEO frontmatter
 */
function createBlogPost(title, description, image, category, keywords = [], content = '') {
  const frontmatter = generateSEOFrontmatter(title, description, image, category, keywords);
  const slug = generateSlug(title);
  const fileName = `${slug}.md`;
  const filePath = path.join(__dirname, '..', 'public', fileName);
  
  // Default content if none provided
  if (!content) {
    content = `
# ${title}

${description}

<!-- Add your blog post content here -->

## Introduction

Write your introduction here...

## Conclusion

Write your conclusion here...
`;
  }

  const fullContent = frontmatter + '\n\n' + content.trim();
  
  try {
    fs.writeFileSync(filePath, fullContent, 'utf8');
    console.log(`✅ Blog post created: ${fileName}`);
    console.log(`📍 Location: ${filePath}`);
    console.log(`🔗 URL: ${BASE_URL}/blog/${slug}`);
    
    return {
      fileName,
      filePath,
      slug,
      canonical: `${BASE_URL}/blog/${slug}`
    };
  } catch (error) {
    console.error('❌ Error creating blog post:', error.message);
    return null;
  }
}

/**
 * Updates existing blog post with complete SEO frontmatter
 */
function updateExistingBlogPost(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    
    if (!frontmatterMatch) {
      console.error('❌ No frontmatter found in file');
      return false;
    }
    
    const frontmatterContent = frontmatterMatch[1];
    const bodyContent = content.replace(/^---\n[\s\S]*?\n---/, '').trim();
    
    // Parse existing frontmatter
    const frontmatterObj = {};
    frontmatterContent.split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
        frontmatterObj[key] = value;
      }
    });
    
    // Add missing SEO fields
    const title = frontmatterObj.title || 'Untitled';
    const description = frontmatterObj.description || '';
    const image = frontmatterObj.image || '/images/logo.png';
    const category = frontmatterObj.category || DEFAULT_CATEGORY;
    const keywords = frontmatterObj.keywords ? 
      frontmatterObj.keywords.replace(/[\[\]]/g, '').split(',').map(k => k.trim().replace(/^["']|["']$/g, '')) : 
      [];
    
    // Generate updated frontmatter
    const updatedFrontmatter = generateSEOFrontmatter(title, description, image, category, keywords);
    const updatedContent = updatedFrontmatter + '\n\n' + bodyContent;
    
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`✅ Updated blog post: ${path.basename(filePath)}`);
    
    return true;
  } catch (error) {
    console.error('❌ Error updating blog post:', error.message);
    return false;
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log(`
📝 SEO Frontmatter Generator

Usage:
  node generate-seo-frontmatter.js "Title" "Description" [image] [category] [keywords]

Examples:
  node generate-seo-frontmatter.js "How to Be Confident" "Learn confidence building techniques" "/images/confidence.jpg" "Self-Development" "confidence,self-improvement,personal growth"

  Update existing file:
  node generate-seo-frontmatter.js --update path/to/existing-post.md

Arguments:
  title       - Blog post title (required)
  description - SEO description (required)  
  image       - Featured image path (optional, defaults to /images/logo.png)
  category    - Post category (optional, defaults to "Self-Development")
  keywords    - Comma-separated keywords (optional)

Options:
  --update    - Update existing blog post with complete SEO frontmatter
`);
    process.exit(1);
  }

  if (args[0] === '--update') {
    const filePath = args[1];
    if (!filePath || !fs.existsSync(filePath)) {
      console.error('❌ File path required and must exist');
      process.exit(1);
    }
    updateExistingBlogPost(filePath);
  } else {
    const [title, description, image = '/images/logo.png', category = DEFAULT_CATEGORY, keywordsStr = ''] = args;
    const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()) : [];
    
    createBlogPost(title, description, image, category, keywords);
  }
}

module.exports = {
  generateSEOFrontmatter,
  createBlogPost,
  updateExistingBlogPost,
  generateSlug
};