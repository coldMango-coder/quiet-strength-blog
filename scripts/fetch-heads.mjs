import fs from 'fs/promises';
import https from 'https';
import http from 'http';
import { URL } from 'url';

const host = process.env.HOST;
const routes = process.env.ROUTES.split(',');

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    
    const req = client.request(parsedUrl, { 
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CanonicalAuditor/1.0)'
      }
    }, (res) => {
      // Handle redirects manually to catch them
      if (res.statusCode >= 300 && res.statusCode < 400) {
        console.log(`Redirect ${res.statusCode} from ${url} to ${res.headers.location}`);
        return resolve(''); // Empty response for redirects
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
    req.end();
  });
}

function rtrim(s) {
  return s.replace(/\/$/, '');
}

(async () => {
  try {
    const out = [];
    
    for (const r of routes) {
      const u = host + r;
      console.log(`Fetching: ${u}`);
      
      try {
        const html = await fetchHtml(u);
        const canonicalMatches = [...html.matchAll(/<link[^>]+rel=["']canonical["'][^>]*>/gi)];
        const canonicalLinks = canonicalMatches.map(x => x[0]);
        
        let href = null;
        if (canonicalLinks.length > 0) {
          const hrefMatch = canonicalLinks[0].match(/href=["']([^"']+)/i);
          href = hrefMatch ? hrefMatch[1] : null;
        }
        
        out.push({
          route: r,
          canonical: href,
          count: canonicalLinks.length,
          canonicalLinks: canonicalLinks
        });
        
        console.log(`Route ${r}: ${canonicalLinks.length} canonical(s), href: ${href}`);
      } catch (err) {
        console.error(`Error fetching ${u}:`, err.message);
        out.push({
          route: r,
          canonical: null,
          count: 0,
          error: err.message
        });
      }
    }
    
    await fs.writeFile('reports/canonical-scan.json', JSON.stringify(out, null, 2));
    console.log('Report written to reports/canonical-scan.json');
    
    // Check for issues
    const hasIssues = out.some(x => 
      x.count !== 1 || 
      !x.canonical || 
      !x.canonical.includes(rtrim(host) + x.route)
    );
    
    if (hasIssues) {
      console.log('❌ Issues found with canonical URLs');
      process.exitCode = 2;
    } else {
      console.log('✅ All canonical URLs look correct');
    }
  } catch (error) {
    console.error('Script error:', error);
    process.exitCode = 1;
  }
})();