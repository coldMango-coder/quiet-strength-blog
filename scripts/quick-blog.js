#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const categories = [
  'Introversion & Personality',
  'Relationships & Dating', 
  'Career & Workplace',
  'Self-Development',
  "Women's Wellness"
];

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function createQuickBlog() {
  console.log('🚀 Quick Blog Creator\n');
  console.log('This will guide you through creating a new blog post step by step.\n');

  try {
    // Get basic information
    const title = await question('📝 Blog title: ');
    if (!title.trim()) {
      console.log('❌ Title is required');
      process.exit(1);
    }

    // Show categories
    console.log('\n📂 Available categories:');
    categories.forEach((cat, index) => {
      console.log(`  ${index + 1}. ${cat}`);
    });
    
    const categoryIndex = await question('\n🏷️  Choose category (1-5): ');
    const categoryNum = parseInt(categoryIndex);
    
    if (categoryNum < 1 || categoryNum > 5) {
      console.log('❌ Invalid category selection');
      process.exit(1);
    }
    
    const category = categories[categoryNum - 1];

    const description = await question('\n📄 Meta description (150-160 chars): ');
    if (!description.trim()) {
      console.log('❌ Description is required');
      process.exit(1);
    }

    const keywords = await question('\n🔍 Keywords (comma-separated): ');
    const image = await question('\n🖼️  Featured image path (optional, press Enter for default): ');

    console.log('\n✍️  Now write your blog content. Type your content and press Ctrl+D when finished:\n');

    // Get content from stdin
    let content = '';
    process.stdin.setEncoding('utf8');
    
    for await (const chunk of process.stdin) {
      content += chunk;
    }

    if (!content.trim()) {
      console.log('❌ Content is required');
      process.exit(1);
    }

    // Create the blog post
    const { createBlogPost, updateSitemap } = require('./create-blog-post.js');
    
    const options = {
      title: title.trim(),
      category,
      description: description.trim(),
      content: content.trim(),
      keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
      image: image.trim() || '/images/default-blog-image.jpg'
    };

    const { blogPost, slug, date } = createBlogPost(options);
    
    // Write to file
    const outputPath = path.join(__dirname, '..', 'public', `${slug}.md`);
    fs.writeFileSync(outputPath, blogPost);
    
    console.log(`\n✅ Blog post created successfully!`);
    console.log(`📁 File: ${outputPath}`);
    console.log(`🔗 URL: https://trueallyguide.com/blog/${slug}`);
    
    // Update sitemap
    updateSitemap(slug, date);
    
    console.log(`\n🎉 All done! Your blog is ready to publish.`);
    
  } catch (error) {
    console.error('❌ Error creating blog post:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Interactive mode by default
if (require.main === module) {
  createQuickBlog();
}

module.exports = { createQuickBlog };