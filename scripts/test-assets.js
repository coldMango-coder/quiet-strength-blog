#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const cheerio = require('cheerio');

async function checkAsset(url) {
  return new Promise((resolve) => {
    const lib = url.startsWith('https:') ? https : http;
    
    const request = lib.get(url, { timeout: 10000 }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        contentType: res.headers['content-type'] || 'unknown',
        contentLength: res.headers['content-length'] || 'unknown'
      });
    });
    
    request.on('error', (err) => {
      resolve({ url, status: 'ERROR', error: err.message });
    });
    
    request.on('timeout', () => {
      resolve({ url, status: 'TIMEOUT', error: 'Request timeout' });
    });
  });
}

function extractAssetsFromHTML(htmlPath) {
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  const $ = cheerio.load(htmlContent);
  
  const assets = [];
  console.log(`📄 Parsing HTML content (${htmlContent.length} characters)`);
  
  // Extract CSS files
  $('link[rel="stylesheet"]').each((_, element) => {
    const href = $(element).attr('href');
    if (href) assets.push({ type: 'CSS', url: href });
  });
  
  // Extract JS files
  $('script[src]').each((_, element) => {
    const src = $(element).attr('src');
    if (src) assets.push({ type: 'JS', url: src });
  });
  
  // Extract preload assets
  $('link[rel="preload"]').each((_, element) => {
    const href = $(element).attr('href');
    const as = $(element).attr('as');
    if (href) assets.push({ type: `PRELOAD (${as || 'unknown'})`, url: href });
  });
  
  // Extract images in HTML
  $('img[src]').each((_, element) => {
    const src = $(element).attr('src');
    if (src) assets.push({ type: 'IMG', url: src });
  });
  
  // Extract favicon and other icons
  $('link[rel="icon"], link[rel="apple-touch-icon"], link[rel="shortcut icon"]').each((_, element) => {
    const href = $(element).attr('href');
    if (href) assets.push({ type: 'ICON', url: href });
  });
  
  console.log(`📋 Extracted ${assets.length} assets:`, assets.map(a => `${a.type}: ${a.url}`));
  
  return assets;
}

function normalizeUrl(url, baseUrl = 'https://trueallyguide.com') {
  if (url.startsWith('http')) return url;
  if (url.startsWith('//')) return 'https:' + url;
  if (url.startsWith('/')) return baseUrl + url;
  if (url.startsWith('%PUBLIC_URL%/')) return baseUrl + '/' + url.replace('%PUBLIC_URL%/', '');
  return baseUrl + '/' + url;
}

async function main() {
  console.log('🔍 Asset Testing Script - Checking for 404s and broken references\n');
  
  // Test build HTML
  const buildHtmlPath = 'build/index.html';
  const publicHtmlPath = 'public/index.html';
  
  let htmlPath;
  if (fs.existsSync(buildHtmlPath)) {
    htmlPath = buildHtmlPath;
    console.log(`📄 Testing built HTML: ${buildHtmlPath}`);
  } else if (fs.existsSync(publicHtmlPath)) {
    htmlPath = publicHtmlPath;
    console.log(`📄 Testing template HTML: ${publicHtmlPath}`);
  } else {
    console.error('❌ No HTML file found to test');
    process.exit(1);
  }
  
  try {
    const assets = extractAssetsFromHTML(htmlPath);
    if (!assets || assets.length === 0) {
      console.log('⚠️ No assets found to test');
      return;
    }
    
    console.log(`\n📊 Found ${assets.length} assets to test\n`);
    
    const results = [];
    let passCount = 0;
    let failCount = 0;
    
    for (const asset of assets) {
      const normalizedUrl = normalizeUrl(asset.url);
      process.stdout.write(`Testing ${asset.type}: ${asset.url} ... `);
      
      const result = await checkAsset(normalizedUrl);
      results.push({ ...asset, ...result });
      
      if (result.status === 200) {
        console.log('✅ OK');
        passCount++;
      } else if (result.status >= 300 && result.status < 400) {
        console.log(`⚠️  ${result.status} (Redirect)`);
        passCount++;
      } else {
        console.log(`❌ ${result.status} ${result.error || ''}`);
        failCount++;
      }
    }
    
    console.log(`\n📊 Asset Test Results:`);
    console.log(`✅ Accessible: ${passCount}`);
    console.log(`❌ Broken: ${failCount}`);
    console.log(`📈 Success Rate: ${Math.round((passCount / assets.length) * 100)}%`);
    
    // Show failed assets
    if (failCount > 0) {
      console.log(`\n❌ Failed Assets:`);
      results.filter(r => r.status >= 400 || r.status === 'ERROR').forEach(result => {
        console.log(`  - ${result.type}: ${result.url} (${result.status})`);
      });
    }
    
    // Save detailed report
    const reportPath = 'reports/assets-test.json';
    fs.mkdirSync('reports', { recursive: true });
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\n📋 Detailed report saved to: ${reportPath}`);
    
    if (failCount > 0) {
      console.log(`\n❌ ${failCount} assets failed. Please fix broken references.`);
      process.exit(1);
    } else {
      console.log(`\n🎉 All assets accessible!`);
      process.exit(0);
    }
    
  } catch (error) {
    console.error(`❌ Error testing assets: ${error.message}`);
    process.exit(1);
  }
}

// Handle missing cheerio dependency gracefully
try {
  require('cheerio');
} catch (error) {
  console.error('❌ Missing dependency: cheerio');
  console.log('📦 Please install with: npm install cheerio --save-dev');
  process.exit(1);
}

main().catch(error => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});