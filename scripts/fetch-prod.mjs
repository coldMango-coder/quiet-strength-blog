import fs from 'fs/promises'; 

const host = process.env.HOST || 'https://trueallyguide.com'; 
const routes = (process.env.ROUTES || '/blog/how-to-stop-attracting-narcissists-9-proven-strategies,/blog/introvert-networking-tips-without-small-talk-guide').split(',');

console.log('Host:', JSON.stringify(host));
console.log('Routes:', routes); 

(async () => {
    const out = []; 
    for (const r of routes) {
        const res = await fetch(host + r, { redirect: 'follow' }); 
        const html = await res.text(); 
        const can = (html.match(/<link[^>]+rel=[\"']canonical[\"'][^>]*href=[\"']([^\"']+)/i) || [])[1] || null; 
        const og = (html.match(/<meta[^>]+property=[\"']og:url[\"'][^>]*content=[\"']([^\"']+)/i) || [])[1] || null; 
        const gen = /(meta name=\"generator\" content=\"React)/i.test(html) ? 'CRA' : '?'; 
        const ver = res.headers.get('x-vercel-cache'); 
        out.push({
            route: r,
            status: res.status,
            canonical: can,
            ogUrl: og,
            vercelCache: ver,
            react: gen
        }); 
    } 
    await fs.writeFile('reports/scan-prod.json', JSON.stringify(out, null, 2)); 
    if (out.some(x => x.canonical === host + '/')) process.exitCode = 2; 
})();