import fs from 'fs/promises';
const host = 'https://trueallyguide.com';
const routes = ['/blog/how-to-stop-attracting-narcissists-9-proven-strategies', '/blog/introvert-networking-tips-without-small-talk-guide'];
(async () => {
  const out = [];
  for (const r of routes) {
    try {
      const res = await fetch(host + r, { headers: { 'Cache-Control': 'no-cache' } });
      const html = await res.text();
      const m = html.match(/<link[^>]+rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)/i);
      const canonical = m ? m[1] : null;
      out.push({ route: r, canonical, status: res.status });
      console.log(`${r}: ${canonical} (${res.status})`);
    } catch (error) {
      console.error(`Error fetching ${r}:`, error.message);
      out.push({ route: r, canonical: null, error: error.message });
    }
  }
  await fs.writeFile('deploy/prod-scan.json', JSON.stringify(out, null, 2));
  
  // Check if canonicals match expected format
  const bad = out.filter(x => !x.canonical || !x.canonical.includes(x.route));
  if (bad.length > 0) {
    console.log('Issues found:', bad);
    process.exit(2);
  }
  console.log('✅ All canonical URLs are correct');
})();