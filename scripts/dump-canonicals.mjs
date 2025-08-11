import fs from 'fs/promises';

const paths = [
  'build/blog/how-to-stop-attracting-narcissists-9-proven-strategies/index.html',
  'build/blog/introvert-networking-tips-without-small-talk-guide/index.html'
];

const out = [];

for (const filePath of paths) {
  try {
    const html = await fs.readFile(filePath, 'utf8');
    const can = (html.match(/<link[^>]+rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)/i) || [])[1] || null;
    const og = (html.match(/<meta[^>]+property=[\"']og:url[\"'][^>]*content=[\"']([^\"']+)/i) || [])[1] || null;
    
    out.push({
      path: filePath,
      canonical: can,
      ogUrl: og,
      exists: true
    });
  } catch (error) {
    out.push({
      path: filePath,
      canonical: null,
      ogUrl: null,
      exists: false,
      error: error.message
    });
  }
}

await fs.writeFile('reports/scan-build.json', JSON.stringify(out, null, 2));
console.log('Build scan complete. Results saved to reports/scan-build.json');