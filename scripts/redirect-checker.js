const https = require('https');
const http = require('http');
const fs = require('fs');

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
      const request = lib.get(reqUrl, { timeout: 10000 }, (res) => {
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
            finalUrl: reqUrl
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

async function main() {
  const testUrls = [
    'http://trueallyguide.com/',
    'https://trueallyguide.com/',
    'https://www.trueallyguide.com/',
    'https://trueallyguide.com/blog/how-to-say-no-without-guilt',
    'https://trueallyguide.com/blog/how-to-say-no-without-guilt/',
    'https://trueallyguide.com/category/Introversion%20%26%20Personality',
    'https://trueallyguide.com/category/Relationships%20%26%20Dating',
    'https://trueallyguide.com/category/Self-Development',
    'https://trueallyguide.com/category/Career%20%26%20Workplace'
  ];
  
  console.log('Checking redirect chains...\n');
  const results = [];
  
  for (const url of testUrls) {
    console.log(`Testing: ${url}`);
    const result = await checkUrl(url);
    results.push(result);
    
    if (result.error) {
      console.log(`  Error: ${result.error}`);
    } else if (result.chain.length > 1) {
      console.log(`  Redirect chain (${result.chain.length} hops):`);
      result.chain.forEach((hop, i) => {
        console.log(`    ${i + 1}. ${hop.status} ${hop.url} ${hop.location ? '→ ' + hop.location : ''}`);
      });
    } else {
      console.log(`  Direct response: ${result.finalStatus}`);
    }
    console.log();
  }
  
  // Generate CSV report
  const csvLines = ['URL,Status,Redirects,Final URL,Issues'];
  results.forEach(result => {
    const redirectCount = result.chain ? result.chain.length - 1 : 0;
    const issues = [];
    
    if (result.error) {
      issues.push(result.error);
    }
    if (redirectCount > 0) {
      issues.push(`${redirectCount} redirects`);
    }
    if (result.chain && result.chain.some(hop => hop.status === 302)) {
      issues.push('302 temporary redirect found');
    }
    
    csvLines.push([
      result.url,
      result.finalStatus || 'ERROR',
      redirectCount,
      result.finalUrl || '',
      issues.join('; ')
    ].join(','));
  });
  
  fs.writeFileSync('reports/redirects.csv', csvLines.join('\n'));
  console.log('Report saved to reports/redirects.csv');
  
  // Count issues
  const problemCount = results.filter(r => r.error || (r.chain && r.chain.length > 1)).length;
  console.log(`\nSummary: ${problemCount}/${results.length} URLs have redirect issues`);
  
  if (problemCount > 0) {
    process.exit(1);
  }
}

main().catch(console.error);