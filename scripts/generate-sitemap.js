const fs = require('fs');
const path = require('path');

// Manually define blog data since we can't import React components in Node
const categories = {
  INTROVERSION_PERSONALITY: 'Introversion & Personality',
  RELATIONSHIPS_DATING: 'Relationships & Dating',
  CAREER_WORKPLACE: 'Career & Workplace',
  SELF_DEVELOPMENT: 'Self-Development',
  WOMENS_WELLNESS: 'Women\'s Wellness',
};

const blogPosts = [
  {
    slug: 'how-to-speak-up-in-meetings-introvert-strategies-2025',
    title: 'How to Speak Up in Meetings as an Introvert: 9 Proven Strategies That Actually Work in 2025',
    date: '2025-07-22',
    category: categories.CAREER_WORKPLACE,
  },
  {
    slug: 'intentional-dating-2025-guide',
    title: 'Intentional Dating 2025: How to Date Purposefully (7 Proven Steps)',
    date: '2025-07-21',
    category: categories.RELATIONSHIPS_DATING,
  },
  {
    slug: 'introvert-social-battery-drained-recovery-methods',
    title: 'Introvert Social Battery Drained: 9 Proven Recovery Methods That Actually Work in 2025',
    date: '2025-07-20',
    category: categories.INTROVERSION_PERSONALITY,
  },
  {
    slug: 'how-to-know-if-you-deserve-better-relationship-introvert-woman-guide',
    title: 'How to Know if You Deserve Better in Your Relationship: 7 Clear Signs Every Introvert Woman Must Recognize in 2025',
    date: '2025-07-19',
    category: categories.RELATIONSHIPS_DATING,
  },
  {
    slug: 'how-to-say-no-without-guilt',
    title: 'How to Say No Without Guilt: Real-Life Scripts for Work, Family & Friends',
    date: '2025-07-18',
    category: categories.RELATIONSHIPS_DATING,
  },
  {
    slug: 'art-of-saying-no',
    title: 'The Art of Saying No: A Guide for People-Pleasers',
    date: '2025-07-14',
    category: categories.SELF_DEVELOPMENT,
  },
  {
    slug: 'prevent-professional-burnout',
    title: "How to Prevent Professional Burnout: A Woman's Essential Guide",
    date: '2025-07-12',
    category: categories.CAREER_WORKPLACE,
  },
  {
    slug: 'building-quiet-confidence',
    title: "Building Quiet Confidence: An Introvert's Guide",
    date: '2025-07-10',
    category: categories.INTROVERSION_PERSONALITY,
  },
  {
    slug: 'introvert-friendly-productivity',
    title: 'Introvert-Friendly Productivity',
    date: '2025-07-08',
    category: categories.INTROVERSION_PERSONALITY,
  },
];

const sortedBlogPosts = blogPosts.sort((a, b) => new Date(b.date) - new Date(a.date));

const baseUrl = 'https://trueallyguide.com';

function formatDate(dateString) {
  return new Date(dateString).toISOString().split('T')[0];
}

function generateSitemap() {
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
    ...Object.values(categories).map(category => ({
      loc: `${baseUrl}/category/${encodeURIComponent(category)}`,
      lastmod: formatDate(new Date()),
      changefreq: 'weekly',
      priority: '0.8'
    })),
    // Individual blog posts
    ...sortedBlogPosts.map(post => ({
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
  console.log(`Sitemap generated successfully at ${sitemapPath}`);
  console.log(`Total URLs: ${urls.length}`);
}

generateSitemap();