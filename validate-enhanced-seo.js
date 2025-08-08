#!/usr/bin/env node

/**
 * Comprehensive SEO validation for enhanced meta tags and schema.org structured data
 * Tests canonical tags, Open Graph, Twitter Cards, and JSON-LD for all page types
 */

const fs = require('fs');
const path = require('path');

const BUILD_DIR = path.join(__dirname, 'build');

// Test cases for different page types
const testCases = [
  {
    name: 'Homepage',
    file: 'index.html',
    expectedPageType: 'homepage',
    expectedCanonical: 'https://trueallyguide.com/',
    expectedTitle: 'Quiet Strength – Self-Help & Productivity for Introverted Women',
    expectedOgType: 'website',
    expectedSchemaTypes: ['WebSite', 'Organization']
  },
  {
    name: 'Blog Listing',
    file: 'blog/index.html',
    expectedPageType: 'blog-listing',
    expectedCanonical: 'https://trueallyguide.com/blog',
    expectedTitle: 'Blog | Quiet Strength',
    expectedOgType: 'website',
    expectedSchemaTypes: ['Blog']
  },
  {
    name: 'Blog Post',
    file: 'blog/art-of-saying-no/index.html',
    expectedPageType: 'blog-post',
    expectedCanonical: 'https://trueallyguide.com/blog/art-of-saying-no',
    expectedTitle: 'The Art of Saying No: A Guide for People-Pleasers | Quiet Strength',
    expectedOgType: 'article',
    expectedSchemaTypes: ['BlogPosting']
  },
  {
    name: 'Category Page',
    file: 'category/relationships-and-dating/index.html',
    expectedPageType: 'category',
    expectedCanonical: 'https://trueallyguide.com/category/relationships-and-dating',
    expectedTitle: 'Relationships & Dating Articles | Quiet Strength',
    expectedOgType: 'website',
    expectedSchemaTypes: ['CollectionPage']
  }
];

// Extract meta tags from HTML content
function extractMetaTags(html) {
  const meta = {};
  
  // Canonical
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
  meta.canonical = canonicalMatch ? canonicalMatch[1] : null;
  
  // Title
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  meta.title = titleMatch ? titleMatch[1] : null;
  
  // Description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["'][^>]*>/i);
  meta.description = descMatch ? descMatch[1] : null;
  
  // Keywords
  const keywordsMatch = html.match(/<meta\s+name=["']keywords["']\s+content=["']([^"']+)["'][^>]*>/i);
  meta.keywords = keywordsMatch ? keywordsMatch[1].split(', ') : [];
  
  // Open Graph
  meta.og = {};
  const ogMatches = html.match(/<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/gi);
  if (ogMatches) {
    ogMatches.forEach(match => {
      const [, property, content] = match.match(/<meta\s+property=["']og:([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/i);
      meta.og[property] = content;
    });
  }
  
  // Twitter Cards
  meta.twitter = {};
  const twitterMatches = html.match(/<meta\s+name=["']twitter:([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/gi);
  if (twitterMatches) {
    twitterMatches.forEach(match => {
      const [, property, content] = match.match(/<meta\s+name=["']twitter:([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/i);
      meta.twitter[property] = content;
    });
  }
  
  // Article meta (for blog posts)
  meta.article = {};
  const articleMatches = html.match(/<meta\s+property=["']article:([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/gi);
  if (articleMatches) {
    articleMatches.forEach(match => {
      const [, property, content] = match.match(/<meta\s+property=["']article:([^"']+)["']\s+content=["']([^"']+)["'][^>]*>/i);
      if (property === 'tag') {
        meta.article.tags = meta.article.tags || [];
        meta.article.tags.push(content);
      } else {
        meta.article[property] = content;
      }
    });
  }
  
  // JSON-LD Schema
  const schemaMatches = html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/gi);
  meta.schemas = [];
  if (schemaMatches) {
    schemaMatches.forEach(match => {
      const jsonMatch = match.match(/<script\s+type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/i);
      if (jsonMatch) {
        try {
          const schema = JSON.parse(jsonMatch[1]);
          meta.schemas.push(schema);
        } catch (e) {
          console.warn('Failed to parse JSON-LD:', e.message);
        }
      }
    });
  }
  
  return meta;
}

// Validate individual test case
function validateTestCase(testCase) {
  const filePath = path.join(BUILD_DIR, testCase.file);
  const results = {
    name: testCase.name,
    file: testCase.file,
    passed: [],
    failed: [],
    warnings: []
  };
  
  try {
    if (!fs.existsSync(filePath)) {
      results.failed.push(`File does not exist: ${testCase.file}`);
      return results;
    }
    
    const html = fs.readFileSync(filePath, 'utf8');
    const meta = extractMetaTags(html);
    
    // Test canonical URL
    if (meta.canonical === testCase.expectedCanonical) {
      results.passed.push('Canonical URL matches expected');
    } else {
      results.failed.push(`Canonical mismatch: expected "${testCase.expectedCanonical}", got "${meta.canonical}"`);
    }
    
    // Test title
    if (meta.title === testCase.expectedTitle) {
      results.passed.push('Title matches expected');
    } else {
      results.failed.push(`Title mismatch: expected "${testCase.expectedTitle}", got "${meta.title}"`);
    }
    
    // Test Open Graph type
    if (meta.og.type === testCase.expectedOgType) {
      results.passed.push('OG type matches expected');
    } else {
      results.failed.push(`OG type mismatch: expected "${testCase.expectedOgType}", got "${meta.og.type}"`);
    }
    
    // Test Open Graph URL matches canonical
    if (meta.og.url === testCase.expectedCanonical) {
      results.passed.push('OG URL matches canonical');
    } else {
      results.failed.push(`OG URL doesn't match canonical: OG="${meta.og.url}", canonical="${meta.canonical}"`);
    }
    
    // Test Twitter URL matches canonical
    if (meta.twitter.url === testCase.expectedCanonical) {
      results.passed.push('Twitter URL matches canonical');
    } else {
      results.failed.push(`Twitter URL doesn't match canonical: Twitter="${meta.twitter.url}", canonical="${meta.canonical}"`);
    }
    
    // Test required meta tags presence
    const requiredTags = ['title', 'description'];
    requiredTags.forEach(tag => {
      if (meta[tag]) {
        results.passed.push(`Has ${tag} meta tag`);
      } else {
        results.failed.push(`Missing ${tag} meta tag`);
      }
    });
    
    // Test required OG tags
    const requiredOgTags = ['title', 'description', 'url', 'type', 'image'];
    requiredOgTags.forEach(tag => {
      if (meta.og[tag]) {
        results.passed.push(`Has og:${tag} tag`);
      } else {
        results.failed.push(`Missing og:${tag} tag`);
      }
    });
    
    // Test required Twitter tags
    const requiredTwitterTags = ['card', 'title', 'description', 'url', 'image'];
    requiredTwitterTags.forEach(tag => {
      if (meta.twitter[tag]) {
        results.passed.push(`Has twitter:${tag} tag`);
      } else {
        results.failed.push(`Missing twitter:${tag} tag`);
      }
    });
    
    // Test schema.org structured data
    if (meta.schemas.length > 0) {
      results.passed.push(`Has ${meta.schemas.length} JSON-LD schema(s)`);
      
      const foundSchemaTypes = meta.schemas.map(schema => schema['@type']).flat();
      testCase.expectedSchemaTypes.forEach(expectedType => {
        if (foundSchemaTypes.includes(expectedType)) {
          results.passed.push(`Has ${expectedType} schema`);
        } else {
          results.failed.push(`Missing ${expectedType} schema`);
        }
      });
      
      // Validate schema structure
      meta.schemas.forEach((schema, index) => {
        if (schema['@context'] === 'https://schema.org') {
          results.passed.push(`Schema ${index + 1} has correct @context`);
        } else {
          results.failed.push(`Schema ${index + 1} missing or incorrect @context`);
        }
      });
    } else {
      results.failed.push('No JSON-LD schemas found');
    }
    
    // Blog post specific tests
    if (testCase.expectedPageType === 'blog-post') {
      // Test article meta tags
      if (meta.article.published_time) {
        results.passed.push('Has article:published_time');
      } else {
        results.failed.push('Missing article:published_time');
      }
      
      if (meta.article.author) {
        results.passed.push('Has article:author');
      } else {
        results.failed.push('Missing article:author');
      }
      
      if (meta.article.tags && meta.article.tags.length > 0) {
        results.passed.push(`Has ${meta.article.tags.length} article tags`);
      } else {
        results.warnings.push('No article tags found');
      }
    }
    
    // Test keywords
    if (meta.keywords.length > 0) {
      results.passed.push(`Has ${meta.keywords.length} keywords`);
    } else {
      results.warnings.push('No keywords meta tag');
    }
    
  } catch (error) {
    results.failed.push(`Validation error: ${error.message}`);
  }
  
  return results;
}

// Main validation function
function validateEnhancedSEO() {
  console.log('🔍 Enhanced SEO Validation');
  console.log('Testing canonical tags, Open Graph, Twitter Cards, and schema.org JSON-LD');
  console.log('='.repeat(80));
  
  let totalPassed = 0;
  let totalFailed = 0;
  let totalWarnings = 0;
  const allResults = [];
  
  testCases.forEach(testCase => {
    console.log(`\n📄 Testing: ${testCase.name} (${testCase.file})`);
    console.log('-'.repeat(60));
    
    const results = validateTestCase(testCase);
    allResults.push(results);
    
    // Display results
    results.passed.forEach(msg => {
      console.log(`✅ ${msg}`);
      totalPassed++;
    });
    
    results.failed.forEach(msg => {
      console.log(`❌ ${msg}`);
      totalFailed++;
    });
    
    results.warnings.forEach(msg => {
      console.log(`⚠️  ${msg}`);
      totalWarnings++;
    });
    
    const passRate = ((results.passed.length / (results.passed.length + results.failed.length)) * 100).toFixed(1);
    console.log(`📊 ${testCase.name}: ${results.passed.length} passed, ${results.failed.length} failed (${passRate}% pass rate)`);
  });
  
  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📋 ENHANCED SEO VALIDATION SUMMARY');
  console.log('='.repeat(80));
  
  const overallPassRate = ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1);
  console.log(`📊 Overall: ${totalPassed} passed, ${totalFailed} failed, ${totalWarnings} warnings (${overallPassRate}% pass rate)`);
  
  const criticalFailed = allResults.some(r => r.failed.some(f => f.includes('canonical') || f.includes('schema')));
  
  if (totalFailed === 0) {
    console.log('\n🎉 Perfect SEO Implementation!');
    console.log('✨ All pages have unique canonical tags');
    console.log('🎯 All Open Graph and Twitter meta tags are correct');
    console.log('🏗️  All schema.org structured data is valid');
    console.log('🔍 Ready for Google indexing and social sharing');
    return true;
  } else if (!criticalFailed && totalFailed < 5) {
    console.log('\n✅ Good SEO Implementation with minor issues');
    console.log('🎯 Core functionality (canonicals, schemas) working correctly');
    console.log('🔧 Minor optimizations needed');
    return true;
  } else {
    console.log('\n⚠️  SEO implementation needs attention');
    console.log('🔧 Critical issues found that may impact search indexing');
    return false;
  }
}

// Google Rich Results Test validation
function validateForRichResults() {
  console.log('\n🔍 Rich Results Compatibility Check');
  console.log('-'.repeat(50));
  
  testCases.forEach(testCase => {
    const filePath = path.join(BUILD_DIR, testCase.file);
    if (fs.existsSync(filePath)) {
      const html = fs.readFileSync(filePath, 'utf8');
      const meta = extractMetaTags(html);
      
      console.log(`📄 ${testCase.name}:`);
      meta.schemas.forEach(schema => {
        const type = schema['@type'];
        const hasRequiredFields = type === 'BlogPosting' ? 
          (schema.headline && schema.author && schema.datePublished) :
          (schema.name && schema.url);
        
        console.log(`  ${hasRequiredFields ? '✅' : '❌'} ${type} schema ${hasRequiredFields ? 'eligible' : 'needs work'} for rich results`);
      });
    }
  });
}

// Run if called directly
if (require.main === module) {
  const success = validateEnhancedSEO();
  validateForRichResults();
  process.exit(success ? 0 : 1);
}

module.exports = { validateEnhancedSEO, extractMetaTags, validateTestCase };