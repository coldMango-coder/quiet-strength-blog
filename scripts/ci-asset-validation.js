#!/usr/bin/env node

/**
 * CI Asset Validation Script
 * Crawls for 3xx/4xx asset responses and fails CI on errors
 * 
 * Usage: node scripts/ci-asset-validation.js
 * Exit codes: 0 = success, 1 = failures found
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const cheerio = require('cheerio');

const BASE_URL = 'https://trueallyguide.com';
const BUILD_DIR = path.join(__dirname, '../build');

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'CI Asset Validator/1.0'
      }
    }, (res) => {
      resolve({
        url,
        statusCode: res.statusCode,
        headers: res.headers
      });
    });
    
    req.on('error', (err) => {
      resolve({
        url,
        statusCode: 0,
        error: err.message
      });
    });
    
    req.on('timeout', () => {
      req.destroy();
      resolve({
        url,
        statusCode: 0,
        error: 'Request timeout'
      });
    });
  });
}

function extractAssetsFromHTML(htmlContent, baseUrl) {
  const $ = cheerio.load(htmlContent);
  const assets = [];
  
  // CSS files
  $('link[rel="stylesheet"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('http')) {
      assets.push({
        type: 'CSS',
        url: href.startsWith('/') ? `${baseUrl}${href}` : `${baseUrl}/${href}`
      });
    }
  });
  
  // JavaScript files
  $('script[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('http')) {
      assets.push({
        type: 'JS',
        url: src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`
      });
    }
  });
  
  // Images
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src');
    if (src && !src.startsWith('http') && !src.startsWith('data:')) {
      assets.push({
        type: 'IMG',
        url: src.startsWith('/') ? `${baseUrl}${src}` : `${baseUrl}/${src}`
      });
    }
  });
  
  // Preload resources
  $('link[rel="preload"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('http')) {
      assets.push({
        type: 'PRELOAD',
        url: href.startsWith('/') ? `${baseUrl}${href}` : `${baseUrl}/${href}`
      });
    }
  });
  
  // Icons and favicons
  $('link[rel*="icon"]').each((_, el) => {
    const href = $(el).attr('href');
    if (href && !href.startsWith('http')) {
      assets.push({
        type: 'ICON',
        url: href.startsWith('/') ? `${baseUrl}${href}` : `${baseUrl}/${href}`
      });
    }
  });
  
  return assets;
}

async function validateAssets() {
  console.log('🔍 CI Asset Validation - Checking for broken asset references\n');
  
  // Read built index.html
  const indexPath = path.join(BUILD_DIR, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ Build directory not found. Please run "npm run build" first.');
    process.exit(1);
  }
  
  const htmlContent = fs.readFileSync(indexPath, 'utf8');
  const assets = extractAssetsFromHTML(htmlContent, BASE_URL);
  
  console.log(`📋 Found ${assets.length} assets to validate\n`);
  
  const results = [];
  const failures = [];
  
  // Test all assets
  for (const asset of assets) {
    process.stdout.write(`Testing ${asset.type}: ${asset.url} ... `);
    
    const result = await makeRequest(asset.url);
    results.push({
      ...asset,
      ...result
    });
    
    if (result.error) {
      console.log(`❌ ERROR: ${result.error}`);
      failures.push({ ...asset, reason: `Error: ${result.error}` });
    } else if (result.statusCode >= 400) {
      console.log(`❌ ${result.statusCode}`);
      failures.push({ ...asset, reason: `HTTP ${result.statusCode}` });
    } else if (result.statusCode >= 300) {
      console.log(`⚠️  ${result.statusCode} (Redirect)`);
      // Redirects are warnings but not failures for this CI step
    } else {
      console.log(`✅ ${result.statusCode}`);
    }
  }
  
  // Generate report
  const report = {
    timestamp: new Date().toISOString(),
    totalAssets: assets.length,
    failures: failures.length,
    successRate: Math.round((1 - failures.length / assets.length) * 100),
    assets: results
  };
  
  // Save detailed report
  const reportsDir = path.join(__dirname, '../reports');
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(reportsDir, 'ci-asset-validation.json'),
    JSON.stringify(report, null, 2)
  );
  
  // Print summary
  console.log('\n📊 CI Asset Validation Results:');
  console.log(`✅ Accessible: ${assets.length - failures.length}`);
  console.log(`❌ Failed: ${failures.length}`);
  console.log(`📈 Success Rate: ${report.successRate}%`);
  
  if (failures.length > 0) {
    console.log('\n❌ Failed Assets:');
    failures.forEach(failure => {
      console.log(`   ${failure.type}: ${failure.url} (${failure.reason})`);
    });
    
    console.log('\n💥 CI Asset Validation FAILED');
    process.exit(1);
  }
  
  console.log('\n🎉 CI Asset Validation PASSED');
  process.exit(0);
}

// Handle uncaught errors
process.on('unhandledRejection', (err) => {
  console.error('💥 Unhandled rejection:', err);
  process.exit(1);
});

process.on('uncaughtException', (err) => {
  console.error('💥 Uncaught exception:', err);
  process.exit(1);
});

// Run validation
validateAssets().catch(err => {
  console.error('💥 Asset validation failed:', err);
  process.exit(1);
});