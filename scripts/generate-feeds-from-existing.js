#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Existing blog posts data (from sitemap analysis)
const existingPosts = [
  {
    title: "How to Speak Up in Meetings: Introvert Strategies for 2025",
    slug: "how-to-speak-up-in-meetings-introvert-strategies-2025",
    date: "2025-07-22",
    category: "Career & Workplace",
    description: "Master the art of speaking up in meetings as an introvert with proven strategies, practical scripts, and confidence-building techniques.",
    author: "Marica Šinko"
  },
  {
    title: "Intentional Dating 2025 Guide",
    slug: "intentional-dating-2025-guide", 
    date: "2025-07-21",
    category: "Relationships & Dating",
    description: "Transform your dating life with intentional dating strategies designed for authentic connections and meaningful relationships.",
    author: "Marica Šinko"
  },
  {
    title: "Introvert Social Battery Drained: Recovery Methods",
    slug: "introvert-social-battery-drained-recovery-methods",
    date: "2025-07-20", 
    category: "Introversion & Personality",
    description: "Discover effective recovery methods when your social battery is drained, with practical strategies for introverts to recharge and restore energy.",
    author: "Marica Šinko"
  },
  {
    title: "How to Know if You Deserve Better in Your Relationship: Introvert Woman Guide",
    slug: "how-to-know-if-you-deserve-better-relationship-introvert-woman-guide",
    date: "2025-07-19",
    category: "Relationships & Dating", 
    description: "Recognize the clear signs you deserve better in your relationship with this comprehensive guide for introvert women, including practical strategies and conversation scripts.",
    author: "Marica Šinko"
  },
  {
    title: "How to Say No Without Guilt",
    slug: "how-to-say-no-without-guilt",
    date: "2025-07-18",
    category: "Self-Development",
    description: "Learn to say no without guilt using proven strategies, practical scripts, and boundary-setting techniques for work, family, and personal situations.",
    author: "Marica Šinko"
  }
];

// Function to generate RSS feed
function generateRSSFeed() {
  const currentDate = new Date().toUTCString();
  
  let rssItems = '';
  existingPosts.forEach(post => {
    const pubDate = new Date(post.date).toUTCString();
    const link = `https://trueallyguide.com/blog/${post.slug}`;
    
    rssItems += `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description><![CDATA[${post.description}]]></description>
      <category><![CDATA[${post.category}]]></category>
      <author>noreply@trueallyguide.com (${post.author})</author>
      <pubDate>${pubDate}</pubDate>
    </item>
`;
  });

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
${rssItems}  </channel>
</rss>`;

  const rssPath = path.join(__dirname, '..', 'public', 'rss.xml');
  fs.writeFileSync(rssPath, rssContent);
  console.log(`✅ Generated RSS feed at: ${rssPath}`);
}

// Function to generate Atom feed
function generateAtomFeed() {
  const currentDate = new Date().toISOString();
  
  let atomEntries = '';
  existingPosts.forEach(post => {
    const isoDate = new Date(post.date).toISOString();
    const link = `https://trueallyguide.com/blog/${post.slug}`;
    
    atomEntries += `  <entry>
    <title type="html"><![CDATA[${post.title}]]></title>
    <link href="${link}"/>
    <id>${link}</id>
    <published>${isoDate}</published>
    <updated>${isoDate}</updated>
    <summary type="html"><![CDATA[${post.description}]]></summary>
    <category term="${post.category}"/>
    <author>
      <name>${post.author}</name>
    </author>
  </entry>
`;
  });

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
${atomEntries}</feed>`;

  const atomPath = path.join(__dirname, '..', 'public', 'atom.xml');
  fs.writeFileSync(atomPath, atomContent);
  console.log(`✅ Generated Atom feed at: ${atomPath}`);
}

// Main function
function main() {
  console.log('🚀 Generating RSS and Atom feeds from existing blog posts...\n');
  
  generateRSSFeed();
  generateAtomFeed();
  
  console.log('\n🎉 Feed generation complete!');
  console.log('📄 Generated files:');
  console.log('   - public/rss.xml');
  console.log('   - public/atom.xml');
  console.log('\n🔗 URLs:');
  console.log('   - RSS: https://trueallyguide.com/rss.xml');
  console.log('   - Atom: https://trueallyguide.com/atom.xml');
  console.log('\nThese feeds will be automatically updated when you create new blog posts using the create-blog-post.js script.');
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { generateRSSFeed, generateAtomFeed, existingPosts };