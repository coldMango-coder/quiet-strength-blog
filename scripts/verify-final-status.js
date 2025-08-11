const https = require('https');
const { URL } = require('url');

async function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {}
    };

    const req = https.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          text: () => Promise.resolve(data)
        });
      });
    });

    req.on('error', reject);
    req.end();
  });
}

const domain = 'trueallyguide.com';
const slugs = [
  '/blog/how-to-stop-attracting-narcissists-9-proven-strategies',
  '/blog/introvert-networking-tips-without-small-talk-guide'
];

(async () => {
  console.log('Testing final deployment status...\n');
  
  for (const slug of slugs) {
    try {
      console.log(`Testing ${slug}...`);
      const r = await fetch('https://' + domain + slug + '?t=' + Date.now(), {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      console.log(`  Status: ${r.status}`);
      
      if (r.status !== 200) {
        console.log('❌ Status failure!');
        continue;
      }
      
      const html = await r.text();
      const canonicalMatch = html.match(/rel=["']canonical["'][^>]*href=["']([^"']+)/i);
      const canonical = canonicalMatch ? canonicalMatch[1] : null;
      
      console.log(`  Canonical: ${canonical}`);
      
      const expectedCanonical = 'https://' + domain + slug;
      if (canonical === expectedCanonical || canonical === expectedCanonical + '/') {
        console.log('✅ Canonical URL correct!');
      } else {
        console.log(`❌ Canonical mismatch! Expected: ${expectedCanonical}`);
        process.exit(2);
      }
      
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      process.exit(2);
    }
    
    console.log('');
  }
  
  console.log('✅ All tests passed!');
})();