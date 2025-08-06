#!/usr/bin/env node

const https = require('https');
const http = require('http');
const fs = require('fs');
const xml2js = require('xml2js');

async function checkUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    const redirectChain = [];
    let currentUrl = url;
    
    function makeRequest(reqUrl, redirectCount = 0) {
      if (redirectCount >= maxRedirects) {
        resolve({ url, chain: redirectChain, error: 'Too many redirects' });
        return;
      }
      
      const lib = reqUrl.startsWith('https:') ? https : http;
      const options = {
        method: 'HEAD',
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; redirect-checker/1.0)'
        }
      };

      const request = lib.get(reqUrl, options, (res) => {
        const statusCode = res.statusCode;
        const location = res.headers.location;
        
        redirectChain.push({
          url: reqUrl,
          status: statusCode,
          location: location
        });
        
        if (statusCode >= 300 && statusCode < 400 && location) {
          const nextUrl = location.startsWith('http') ? location : new URL(location, reqUrl).toString();
          makeRequest(nextUrl, redirectCount + 1);
        } else {
          resolve({
            url,
            chain: redirectChain,
            finalStatus: statusCode,
            finalUrl: reqUrl,
            redirectCount: redirectCount
          });
        }
      });
      
      request.on('error', (err) => {
        resolve({ url, error: err.message, chain: redirectChain });
      });
      
      request.on('timeout', () => {
        resolve({ url, error: 'Timeout', chain: redirectChain });
      });
    }
    
    makeRequest(currentUrl);
  });
}

async function readSitemap() {
  const sitemapPath = 'public/sitemap.xml';
  
  if (!fs.existsSync(sitemapPath)) {
    throw new Error('Sitemap not found at public/sitemap.xml');
  }

  const xmlContent = fs.readFileSync(sitemapPath, 'utf8');
  const parser = new xml2js.Parser();
  
  return new Promise((resolve, reject) => {
    parser.parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }
      
      const urls = result.urlset.url.map(urlObj => urlObj.loc[0]);
      resolve(urls);
    });
  });
}

async function main() {
  console.log('🔍 Starting redirect test...\n');
  
  let testUrls;
  try {
    testUrls = await readSitemap();
    console.log(`📋 Found ${testUrls.length} URLs in sitemap`);
  } catch (error) {
    console.error('❌ Error reading sitemap:', error.message);
    console.log('📝 Using fallback test URLs...');
    testUrls = [
      'https://trueallyguide.com/',
      'https://trueallyguide.com/blog',
      'https://trueallyguide.com/category/introversion-and-personality',
      'https://trueallyguide.com/category/relationships-and-dating',
      'https://trueallyguide.com/category/career-and-workplace', 
      'https://trueallyguide.com/category/self-development'
    ];
  }
  
  // Add some test URLs that should redirect properly
  const redirectTestUrls = [
    'http://trueallyguide.com/',
    'https://www.trueallyguide.com/',
    'https://trueallyguide.com/category/Introversion%20%26%20Personality',
    'https://trueallyguide.com/category/Relationships%20%26%20Dating'
  ];
  
  const allUrls = [...testUrls, ...redirectTestUrls];
  console.log(`🧪 Testing ${allUrls.length} URLs total\n`);
  
  const results = [];
  let passCount = 0;
  let failCount = 0;
  
  for (const url of allUrls) {
    process.stdout.write(`Testing: ${url.replace('https://trueallyguide.com', '')} ... `);
    
    const result = await checkUrl(url);
    results.push(result);
    
    let passed = false;
    
    if (result.error) {
      console.log(`❌ Error: ${result.error}`);
      failCount++;
    } else if (result.redirectCount > 1) {
      console.log(`❌ Multiple redirects (${result.redirectCount} hops)`);
      failCount++;
    } else if (result.redirectCount === 1 && ![301, 308].includes(result.chain[0].status)) {
      console.log(`⚠️  Non-permanent redirect (${result.chain[0].status})`);
      failCount++;
    } else if (result.finalStatus !== 200) {
      console.log(`❌ Non-200 status: ${result.finalStatus}`);
      failCount++;
    } else {
      if (result.redirectCount === 0) {
        console.log('✅ Direct 200');
      } else {
        console.log('✅ Single 301 → 200');
      }
      passCount++;
      passed = true;
    }
    
    // Log redirect chain for failed tests
    if (!passed && result.chain && result.chain.length > 1) {
      result.chain.forEach((hop, i) => {
        console.log(`  ${i + 1}. ${hop.status} ${hop.url} ${hop.location ? '→ ' + hop.location : ''}`);
      });
    }
  }
  
  console.log(`\n📊 Test Results:`);
  console.log(`✅ Passed: ${passCount}`);
  console.log(`❌ Failed: ${failCount}`);
  console.log(`📈 Success Rate: ${Math.round((passCount / allUrls.length) * 100)}%`);
  
  if (failCount > 0) {
    console.log('\n❌ Some tests failed. Please review the redirect configuration.');
    process.exit(1);
  } else {
    console.log('\n🎉 All redirect tests passed!');
    process.exit(0);
  }
}

// Handle missing xml2js dependency gracefully
try {
  require('xml2js');
} catch (error) {
  console.error('❌ Missing dependency: xml2js');
  console.log('📦 Please install with: npm install xml2js --save-dev');
  process.exit(1);
}

main().catch(error => {
  console.error('❌ Unexpected error:', error.message);
  process.exit(1);
});