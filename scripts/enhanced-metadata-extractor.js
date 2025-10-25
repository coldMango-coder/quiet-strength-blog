#!/usr/bin/env node

/**
 * Enhanced metadata extraction for rich meta tags and schema.org structured data
 * Extracts comprehensive metadata from blogData.js for each route
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://trueallyguide.com';

// Import blog data safely
function getBlogData() {
  const blogDataPath = path.join(__dirname, '../src/blogData.js');
  try {
    // Read and parse the blog data file
    const content = fs.readFileSync(blogDataPath, 'utf8');
    
    // Extract blog posts array using regex (safer than eval)
    const blogPostsMatch = content.match(/export const blogPosts = \[([\s\S]*?)\];/);
    if (!blogPostsMatch) {
      console.warn('Could not extract blog posts from blogData.js');
      return [];
    }
    
    // Parse categories
    const categoriesMatch = content.match(/export const categories = \{([\s\S]*?)\};/);
    const categorySlugMapMatch = content.match(/export const categorySlugMap = \{([\s\S]*?)\};/);
    
    return {
      hasValidData: true,
      rawContent: content
    };
  } catch (error) {
    console.warn('Could not read blogData.js:', error.message);
    return { hasValidData: false };
  }
}

// Extract blog post metadata from blogData.js
function getBlogPostMetadata(slug) {
  const blogData = getBlogData();
  if (!blogData.hasValidData) {
    return getGenericBlogPostMetadata(slug);
  }

  try {
    // Extract specific blog post data using regex
    const postPattern = new RegExp(`\\{[^}]*slug:\\s*['"]${slug}['"][^}]*\\}`, 'g');
    const postMatch = blogData.rawContent.match(postPattern);
    
    if (postMatch && postMatch[0]) {
      const postData = postMatch[0];
      
      // Extract individual fields
      const titleMatch = postData.match(/title:\s*['"](.*?)['"]/);
      const descriptionMatch = postData.match(/description:\s*['"](.*?)['"]/);
      const dateMatch = postData.match(/date:\s*['"](.*?)['"]/);
      const categoryMatch = postData.match(/category:\s*categories\.(\w+)/);
      const imageMatch = postData.match(/image:\s*['"](.*?)['"]/);
      const readTimeMatch = postData.match(/readTime:\s*['"](.*?)['"]/);
      const keywordsMatch = postData.match(/keywords:\s*\[(.*?)\]/);
      
      // Map category enum to display name
      const categoryMap = {
        'RELATIONSHIPS_DATING': 'Relationships & Dating',
        'CAREER_WORKPLACE': 'Career & Workplace',
        'INTROVERSION_PERSONALITY': 'Introversion & Personality',
        'SELF_DEVELOPMENT': 'Self-Development',
        'WOMENS_WELLNESS': 'Women\'s Wellness'
      };
      
      const category = categoryMatch ? categoryMap[categoryMatch[1]] || categoryMatch[1] : 'Self-Development';
      const keywords = keywordsMatch ? keywordsMatch[1].split(',').map(k => k.replace(/['"]/g, '').trim()) : [];
      
      // Short SEO titles map
      const shortTitleBySlug = {
        'how-to-know-if-you-deserve-better-relationship-introvert-woman-guide': 'Do You Deserve Better? 7 Clear Signs for Introvert Women',
        'how-to-stop-attracting-narcissists-9-proven-strategies': 'How to Stop Attracting Narcissists: 9 Proven Strategies',
        'how-to-be-confident-as-an-introvert-woman-guide': 'How to Be Confident as an Introvert Woman',
        'how-to-speak-up-in-meetings-introvert-strategies-2025': 'How to Speak Up in Meetings as an Introvert',
        'introvert-social-battery-drained-recovery-methods': 'Introvert Social Battery Drained? 9 Ways to Recharge',
        'morning-routine-for-confidence-and-productivity-2025': 'Morning Routine for Confidence and Productivity',
        'post-breakup-glow-up-transformation-guide-10-proven-steps-to-become-your-best-self-in-2025': 'Post-Breakup Glow Up: 10 Steps',
      };
      const resolvedTitle = shortTitleBySlug[slug] || (titleMatch ? titleMatch[1] : formatTitle(slug));
      return {
        title: resolvedTitle,
        description: descriptionMatch ? descriptionMatch[1] : `Learn about ${formatTitle(slug).toLowerCase()} and build quiet confidence.`,
        datePublished: dateMatch ? `${dateMatch[1]}T09:00:00-05:00` : new Date().toISOString(),
        dateModified: dateMatch ? `${dateMatch[1]}T09:00:00-05:00` : new Date().toISOString(),
        category: category,
        image: imageMatch ? `${BASE_URL}${imageMatch[1]}` : `${BASE_URL}/images/logo.png`,
        readTime: readTimeMatch ? readTimeMatch[1] : 'PT8M',
        keywords: keywords.length > 0 ? keywords : ['self-help', 'personal development', 'introvert', 'confidence'],
        author: {
          name: 'Marica Šinko',
          url: `${BASE_URL}/author/marica-sinko`
        }
      };
    }
  } catch (error) {
    console.warn(`Error extracting metadata for ${slug}:`, error.message);
  }
  
  return getGenericBlogPostMetadata(slug);
}

// Generic fallback metadata
function getGenericBlogPostMetadata(slug) {
  const title = formatTitle(slug);
  return {
    title: title,
    description: `Learn about ${title.toLowerCase()} and build quiet confidence as an introverted woman.`,
    datePublished: new Date().toISOString(),
    dateModified: new Date().toISOString(),
    category: 'Self-Development',
    image: `${BASE_URL}/images/logo.png`,
    readTime: 'PT8M',
    keywords: ['self-help', 'personal development', 'introvert', 'confidence'],
    author: {
      name: 'Marica Šinko',
      url: `${BASE_URL}/author/marica-sinko`
    }
  };
}

// Format slug to title
function formatTitle(slug) {
  return slug.replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Get category metadata
function getCategoryMetadata(categorySlug) {
  const categoryMap = {
    'relationships-and-dating': {
      name: 'Relationships & Dating',
      description: 'Explore articles on relationships and dating with confidence—boundaries, healthy communication, and intentional choices for introverted women.',
      image: `${BASE_URL}/images/couple-authentic-connection-walk.jpg`
    },
    'career-and-workplace': {
      name: 'Career & Workplace',
      description: 'Advance your career without burnout. Practical advice for introverted women on boundaries, focus, and sustainable success.',
      image: `${BASE_URL}/images/confident-office-meeting-scene.jpg`
    },
    'introversion-and-personality': {
      name: 'Introversion & Personality',
      description: 'Insights on introversion and personality types with practical ways to leverage your strengths as an introverted woman.',
      image: `${BASE_URL}/images/empowered-introvert-woman-standing-confidently-in-peaceful-natural-setting-representing-authentic-confidence-journey-and-quiet-strength-development.jpg`
    },
    'self-development': {
      name: 'Self-Development',
      description: 'Personal growth strategies and practical self-improvement for introverted women — build confidence and momentum with small steps.',
      image: `${BASE_URL}/images/woman-journaling-self-reflection.jpg`
    },
    'womens-wellness': {
      name: 'Women\'s Wellness',
      description: 'Holistic wellness focused on mental health, energy management, and self-care for introverted women.',
      image: `${BASE_URL}/images/woman-mindfulness-burnout-prevention.jpg`
    }
  };
  
  const category = categoryMap[categorySlug];
  if (category) {
    return {
      name: category.name,
      description: category.description,
      image: category.image,
      url: `${BASE_URL}/category/${categorySlug}`
    };
  }
  
  // Fallback
  const name = formatTitle(categorySlug);
  return {
    name: name,
    description: `Articles and guides about ${name.toLowerCase()} for introverted women.`,
    image: `${BASE_URL}/images/logo.png`,
    url: `${BASE_URL}/category/${categorySlug}`
  };
}

// Generate Schema.org JSON-LD for blog posts
function generateBlogPostSchema(url, metadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url
    },
    headline: metadata.title.replace(' | Quiet Strength', ''),
    description: metadata.description,
    image: [metadata.image],
    author: {
      '@type': 'Person',
      name: metadata.author.name,
      url: metadata.author.url
    },
    publisher: {
      '@type': 'Organization',
      name: 'Quiet Strength',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`,
        width: 200,
        height: 200
      }
    },
    datePublished: metadata.datePublished,
    dateModified: metadata.dateModified,
    timeRequired: metadata.readTime,
    keywords: metadata.keywords,
    articleSection: metadata.category,
    inLanguage: 'en-US',
    isAccessibleForFree: true
  };
}

// Generate Schema.org JSON-LD for category pages
function generateCategorySchema(metadata) {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: metadata.name,
    url: metadata.url,
    description: metadata.description,
    image: metadata.image,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Quiet Strength',
      url: BASE_URL
    },
    inLanguage: 'en-US'
  };
}

// Generate Schema.org JSON-LD for homepage
function generateHomepageSchema() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Quiet Strength',
      url: BASE_URL,
      description: 'Self-help and productivity blog for introverted women seeking to build confidence and prevent burnout.',
      potentialAction: {
        '@type': 'SearchAction',
        target: `${BASE_URL}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      },
      inLanguage: 'en-US',
      author: {
        '@type': 'Person',
        name: 'Marica Šinko'
      }
    },
    {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Quiet Strength',
      url: BASE_URL,
      logo: `${BASE_URL}/images/logo.png`,
      description: 'Helping introverted women build confidence and thrive on their own terms.',
      sameAs: [
        'https://twitter.com/QuietStrengthGuide',
        'https://instagram.com/quietstrengthguide'
      ],
      founder: {
        '@type': 'Person',
        name: 'Marica Šinko'
      }
    }
  ];
}

// Generate Schema.org JSON-LD for blog listing page
function generateBlogListingSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'Quiet Strength Blog',
    url: `${BASE_URL}/blog`,
    description: 'Self-help articles and guides for introverted women seeking to build confidence and prevent burnout.',
    author: {
      '@type': 'Person',
      name: 'Marica Šinko'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Quiet Strength',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/images/logo.png`
      }
    },
    inLanguage: 'en-US'
  };
}

module.exports = {
  getBlogPostMetadata,
  getCategoryMetadata,
  generateBlogPostSchema,
  generateCategorySchema,
  generateHomepageSchema,
  generateBlogListingSchema,
  BASE_URL
};
