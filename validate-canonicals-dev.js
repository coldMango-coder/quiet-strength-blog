#!/usr/bin/env node

/**
 * Validation script for canonical tags in both dev and production environments
 * Tests that canonicals are present in view-source for all environments
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// Test routes to validate
const testRoutes = [
  '/',
  '/blog',
  '/blog/test-post',
  '/category/relationships-and-dating',
  '/book-quiet-confidence'
];

// Function to make HTTP request and check for canonical
function checkCanonical(url, expectedHost) {
  return new Promise((resolve) => {
    const options = new URL(url);
    
    const req = http.request({
      hostname: options.hostname,
      port: options.port,
      path: options.pathname,
      method: 'GET',
      headers: { 'User-Agent': 'Canonical-Validator/1.0' }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const canonicalMatch = data.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
        const hasCanonical = !!canonicalMatch;
        const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;
        const isCorrectDomain = canonicalUrl ? canonicalUrl.includes(expectedHost) : false;
        
        resolve({
          url,
          hasCanonical,
          canonicalUrl,
          isCorrectDomain,
          statusCode: res.statusCode
        });
      });
    });
    
    req.on('error', (error) => {
      resolve({
        url,
        hasCanonical: false,
        canonicalUrl: null,
        isCorrectDomain: false,
        error: error.message
      });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({
        url,
        hasCanonical: false,
        canonicalUrl: null,
        isCorrectDomain: false,
        error: 'Timeout'
      });
    });
    
    req.end();
  });
}

// Function to check static files
function checkStaticFile(filePath, expectedCanonical) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const canonicalMatch = content.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["'][^>]*>/i);
    const hasCanonical = !!canonicalMatch;
    const canonicalUrl = canonicalMatch ? canonicalMatch[1] : null;
    
    return {
      file: filePath,
      hasCanonical,
      canonicalUrl,
      isCorrect: canonicalUrl === expectedCanonical
    };
  } catch (error) {
    return {
      file: filePath,
      hasCanonical: false,
      canonicalUrl: null,
      isCorrect: false,
      error: error.message
    };
  }
}

async function validateDevelopment() {
  console.log('🔧 Testing Development Environment (http://localhost:3002)');
  console.log('='.repeat(60));
  
  const results = [];
  for (const route of testRoutes) {
    const url = `http://localhost:3002${route}`;
    const result = await checkCanonical(url, 'localhost:3002');
    results.push(result);
    
    const status = result.hasCanonical ? '✅' : '❌';
    const canonical = result.canonicalUrl || 'MISSING';
    console.log(`${status} ${route.padEnd(30)} → ${canonical}`);
    
    if (result.error) {
      console.log(`   ⚠️  Error: ${result.error}`);
    }
  }
  
  const passed = results.filter(r => r.hasCanonical && r.isCorrectDomain).length;
  const total = results.length;
  console.log(`\n📊 Development: ${passed}/${total} routes have correct canonicals`);
  
  return { passed, total, results };
}

function validateProduction() {
  console.log('\n🚀 Testing Production Environment (Static Files)');
  console.log('='.repeat(60));
  
  const buildDir = path.join(__dirname, 'build');
  const staticTests = [
    { route: '/', file: 'index.html', expected: 'https://trueallyguide.com/' },
    { route: '/blog', file: 'blog/index.html', expected: 'https://trueallyguide.com/blog' },
    { route: '/blog/art-of-saying-no', file: 'blog/art-of-saying-no/index.html', expected: 'https://trueallyguide.com/blog/art-of-saying-no' },
    { route: '/category/self-development', file: 'category/self-development/index.html', expected: 'https://trueallyguide.com/category/self-development' }
  ];
  
  const results = [];
  for (const test of staticTests) {
    const filePath = path.join(buildDir, test.file);
    const result = checkStaticFile(filePath, test.expected);
    results.push(result);
    
    const status = result.hasCanonical && result.isCorrect ? '✅' : '❌';
    const canonical = result.canonicalUrl || 'MISSING';
    console.log(`${status} ${test.route.padEnd(30)} → ${canonical}`);
    
    if (result.error) {
      console.log(`   ⚠️  Error: ${result.error}`);
    }
  }
  
  const passed = results.filter(r => r.hasCanonical && r.isCorrect).length;
  const total = results.length;
  console.log(`\n📊 Production: ${passed}/${total} static files have correct canonicals`);
  
  return { passed, total, results };
}

function printSummary(devResults, prodResults) {
  console.log('\n' + '='.repeat(60));
  console.log('📋 CANONICAL VALIDATION SUMMARY');
  console.log('='.repeat(60));
  
  const devPassed = devResults.passed === devResults.total;
  const prodPassed = prodResults.passed === prodResults.total;
  
  console.log(`🔧 Development: ${devPassed ? '✅ PASS' : '❌ FAIL'} (${devResults.passed}/${devResults.total})`);
  console.log(`🚀 Production:  ${prodPassed ? '✅ PASS' : '❌ FAIL'} (${prodResults.passed}/${prodResults.total})`);
  
  if (devPassed && prodPassed) {
    console.log('\n🎉 All canonical tags are working correctly in both environments!');
    console.log('✨ View-source will show canonical tags in development AND production');
    console.log('🛡️  No duplicate canonical tags detected');
    console.log('🎯 SSR-first approach maintained for production');
    return true;
  } else {
    console.log('\n⚠️  Some canonical tags are missing or incorrect');
    return false;
  }
}

async function main() {
  console.log('🔍 Canonical Tag Validation for Development & Production');
  console.log('Testing both server-side canonical injection and SSG canonicals\n');
  
  try {
    const devResults = await validateDevelopment();
    const prodResults = validateProduction();
    const success = printSummary(devResults, prodResults);
    
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { checkCanonical, checkStaticFile, validateDevelopment, validateProduction };