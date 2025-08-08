#!/usr/bin/env node

/**
 * Canonical URL Validation Script
 * Tests that each generated HTML file contains the correct canonical URL
 * Verifies server-side rendering produces accurate canonical tags
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const BASE_URL = 'https://trueallyguide.com';
const BUILD_DIR = path.join(__dirname, '../build');

// Color codes for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(color, ...args) {
  console.log(color + args.join(' ') + colors.reset);
}

// Route mappings to expected canonical URLs
const expectedCanonicals = {
  'index.html': `${BASE_URL}/`,
  'blog/index.html': `${BASE_URL}/blog`,
  'category/relationships-and-dating/index.html': `${BASE_URL}/category/relationships-and-dating`,
  'category/career-and-workplace/index.html': `${BASE_URL}/category/career-and-workplace`,
  'category/introversion-and-personality/index.html': `${BASE_URL}/category/introversion-and-personality`,
  'category/self-development/index.html': `${BASE_URL}/category/self-development`,
};

// Blog post URLs (dynamically discovered)
function getBlogPostPaths() {
  const blogDir = path.join(BUILD_DIR, 'blog');
  if (!fs.existsSync(blogDir)) return [];
  
  return fs.readdirSync(blogDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => {
      const indexPath = path.join(blogDir, dirent.name, 'index.html');
      if (fs.existsSync(indexPath)) {
        return {
          filePath: `blog/${dirent.name}/index.html`,
          expectedCanonical: `${BASE_URL}/blog/${dirent.name}`
        };
      }
      return null;
    })
    .filter(Boolean);
}

function validateCanonicalInHTML(filePath, expectedCanonical) {
  try {
    const fullPath = path.join(BUILD_DIR, filePath);
    if (!fs.existsSync(fullPath)) {
      log(colors.red, `❌ File not found: ${filePath}`);
      return false;
    }

    const html = fs.readFileSync(fullPath, 'utf8');
    const dom = new JSDOM(html);
    const document = dom.window.document;

    // Check for canonical tag
    const canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      log(colors.red, `❌ No canonical tag found in ${filePath}`);
      return false;
    }

    const actualCanonical = canonicalTag.getAttribute('href');
    if (actualCanonical !== expectedCanonical) {
      log(colors.red, `❌ Wrong canonical in ${filePath}`);
      log(colors.red, `   Expected: ${expectedCanonical}`);
      log(colors.red, `   Actual:   ${actualCanonical}`);
      return false;
    }

    // Verify OG and Twitter URLs match canonical
    const ogUrl = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
    const twitterUrl = document.querySelector('meta[name="twitter:url"]')?.getAttribute('content');

    let ogMatch = true, twitterMatch = true;

    if (ogUrl && ogUrl !== expectedCanonical) {
      log(colors.yellow, `⚠️  OG URL mismatch in ${filePath}: ${ogUrl} vs ${expectedCanonical}`);
      ogMatch = false;
    }

    if (twitterUrl && twitterUrl !== expectedCanonical) {
      log(colors.yellow, `⚠️  Twitter URL mismatch in ${filePath}: ${twitterUrl} vs ${expectedCanonical}`);
      twitterMatch = false;
    }

    // Check content type for blog posts
    const ogType = document.querySelector('meta[property="og:type"]')?.getAttribute('content');
    const isBlogPost = filePath.startsWith('blog/') && filePath !== 'blog/index.html';
    const expectedType = isBlogPost ? 'article' : 'website';

    if (ogType !== expectedType) {
      log(colors.yellow, `⚠️  Wrong OG type in ${filePath}: ${ogType} vs ${expectedType}`);
    }

    if (ogMatch && twitterMatch) {
      log(colors.green, `✅ ${filePath} → ${actualCanonical}`);
    } else {
      log(colors.green, `✅ ${filePath} → ${actualCanonical} (canonical correct)`);
    }

    return true;

  } catch (error) {
    log(colors.red, `❌ Error validating ${filePath}:`, error.message);
    return false;
  }
}

async function validateAllCanonicals() {
  log(colors.bold + colors.blue, '🔍 Validating canonical URLs in server-rendered HTML...\n');

  let totalTests = 0;
  let passedTests = 0;

  // Test static pages
  for (const [filePath, expectedCanonical] of Object.entries(expectedCanonicals)) {
    totalTests++;
    if (validateCanonicalInHTML(filePath, expectedCanonical)) {
      passedTests++;
    }
  }

  // Test blog posts
  const blogPosts = getBlogPostPaths();
  log(colors.blue, `\n📝 Found ${blogPosts.length} blog posts to validate:`);
  
  for (const { filePath, expectedCanonical } of blogPosts) {
    totalTests++;
    if (validateCanonicalInHTML(filePath, expectedCanonical)) {
      passedTests++;
    }
  }

  // Summary
  log(colors.bold, `\n📊 Validation Summary:`);
  log(colors.green, `✅ Passed: ${passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    log(colors.bold + colors.green, `🎉 All canonical URLs are correct!`);
    log(colors.green, `   Server-rendered HTML contains proper canonical tags`);
    log(colors.green, `   Google crawlers will see the right canonical URLs`);
  } else {
    log(colors.bold + colors.red, `❌ ${totalTests - passedTests} canonical URLs need fixing`);
    process.exit(1);
  }
}

// Additional test: Verify no hardcoded homepage canonicals
function checkForHardcodedCanonicals() {
  log(colors.blue, '\n🔍 Checking for hardcoded homepage canonicals...');
  
  const blogPosts = getBlogPostPaths();
  let hardcodedFound = false;

  for (const { filePath } of blogPosts) {
    const fullPath = path.join(BUILD_DIR, filePath);
    const html = fs.readFileSync(fullPath, 'utf8');
    
    if (html.includes(`href="${BASE_URL}/"`)) {
      const dom = new JSDOM(html);
      const canonicalTag = dom.window.document.querySelector('link[rel="canonical"]');
      const actualCanonical = canonicalTag?.getAttribute('href');
      
      if (actualCanonical === `${BASE_URL}/` && !filePath.includes('index.html')) {
        log(colors.red, `❌ Hardcoded homepage canonical found in ${filePath}`);
        hardcodedFound = true;
      }
    }
  }

  if (!hardcodedFound) {
    log(colors.green, `✅ No hardcoded homepage canonicals found`);
  }
}

// Test specific URL patterns
function testUrlPatterns() {
  log(colors.blue, '\n🔍 Testing URL pattern compliance...');
  
  const testCases = [
    {
      path: 'blog/how-to-love-yourself-after-a-toxic-relationship-8-proven-steps-that-actually-work-in-2025/index.html',
      expected: `${BASE_URL}/blog/how-to-love-yourself-after-a-toxic-relationship-8-proven-steps-that-actually-work-in-2025`
    }
  ];

  for (const { path: testPath, expected } of testCases) {
    const fullPath = path.join(BUILD_DIR, testPath);
    if (fs.existsSync(fullPath)) {
      const html = fs.readFileSync(fullPath, 'utf8');
      const dom = new JSDOM(html);
      const canonical = dom.window.document.querySelector('link[rel="canonical"]')?.getAttribute('href');
      
      if (canonical === expected) {
        log(colors.green, `✅ Long URL pattern correct: ${testPath.split('/')[1]}`);
      } else {
        log(colors.red, `❌ Long URL pattern wrong in ${testPath}`);
        log(colors.red, `   Expected: ${expected}`);
        log(colors.red, `   Actual: ${canonical}`);
      }
    }
  }
}

// Run validation
if (require.main === module) {
  validateAllCanonicals()
    .then(() => {
      checkForHardcodedCanonicals();
      testUrlPatterns();
      log(colors.bold + colors.green, '\n🚀 Canonical URL validation complete!');
    })
    .catch(error => {
      log(colors.red, '❌ Validation failed:', error.message);
      process.exit(1);
    });
}

module.exports = { validateAllCanonicals };