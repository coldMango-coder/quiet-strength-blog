const fs = require('fs');

async function fetch(url, options = {}) {
  const https = require('https');
  const { URL } = require('url');
  
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const reqOptions = {
      hostname: parsedUrl.hostname,
      port: parsedUrl.port || 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: options.method || 'GET',
      headers: options.headers || {},
      ...options
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
    if (options.redirect === 'manual') {
      req.on('response', (res) => {
        if ([301, 302, 303, 307, 308].includes(res.statusCode)) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            text: () => Promise.resolve('')
          });
        }
      });
    }
    req.end();
  });
}

const domain = process.env.DOM || 'trueallyguide.com';
const slugs = JSON.parse(process.env.SLUGS || '[]');
const paths = ['/', '/blog', '/sitemap.xml', ...slugs];

(async () => {
  const out = [];
  for (const p of paths) {
    try {
      const r = await fetch('https://' + domain + p, { redirect: 'manual' });
      out.push({
        path: p,
        status: r.status,
        cache: r.headers['x-vercel-cache'] || null
      });
    } catch (err) {
      out.push({
        path: p,
        status: 'ERROR',
        error: err.message
      });
    }
  }
  fs.writeFileSync('reports/status-before.json', JSON.stringify(out, null, 2));
  console.log('Status probe completed:', out);
})();