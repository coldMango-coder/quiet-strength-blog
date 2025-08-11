import fs from 'fs/promises';

const canonical_host = 'trueallyguide.com';
const alt_hosts = ['www.trueallyguide.com', 'truereallyguide.com', 'www.truereallyguide.com'];
const slugs = [
  '/blog/how-to-stop-attracting-narcissists-9-proven-strategies',
  '/blog/introvert-networking-tips-without-small-talk-guide'
];

async function fetchWithDetails(url, followRedirects = false) {
  try {
    const response = await fetch(url, { 
      headers: { 'Cache-Control': 'no-cache' },
      redirect: followRedirects ? 'follow' : 'manual'
    });
    
    let html = '';
    let canonical = null;
    
    if (response.status === 200) {
      html = await response.text();
      const match = html.match(/<link[^>]+rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)/i);
      canonical = match ? match[1] : null;
    }
    
    return {
      url,
      status: response.status,
      canonical,
      location: response.headers.get('location'),
      contentLength: html.length,
      isRedirect: response.status >= 300 && response.status < 400
    };
  } catch (error) {
    return {
      url,
      status: 'ERROR',
      canonical: null,
      error: error.message
    };
  }
}

(async () => {
  console.log('🔍 Probing canonical apex host...');
  const apexResults = [];
  
  for (const slug of slugs) {
    const url = `https://${canonical_host}${slug}`;
    const result = await fetchWithDetails(url, true); // Follow redirects for apex
    apexResults.push(result);
    console.log(`  ${url}: ${result.status} - canonical: ${result.canonical}`);
  }
  
  console.log('\n🔍 Probing alternative hosts...');
  const altResults = [];
  
  for (const host of alt_hosts) {
    for (const slug of slugs) {
      const url = `https://${host}${slug}`;
      const result = await fetchWithDetails(url);
      altResults.push(result);
      console.log(`  ${url}: ${result.status}${result.location ? ` -> ${result.location}` : ''} - canonical: ${result.canonical}`);
    }
  }
  
  // Save results
  await fs.writeFile('reports/canon-apex.json', JSON.stringify(apexResults, null, 2));
  await fs.writeFile('reports/canon-alt.json', JSON.stringify(altResults, null, 2));
  
  console.log('\n📊 Results saved to reports/canon-apex.json and reports/canon-alt.json');
  
  // Quick validation
  const apexIssues = apexResults.filter(r => !r.canonical || !r.canonical.includes(canonical_host));
  if (apexIssues.length > 0) {
    console.log('⚠️  Issues with apex canonicals:', apexIssues.length);
  } else {
    console.log('✅ Apex canonicals look correct');
  }
})();