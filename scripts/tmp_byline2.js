const { chromium } = require("@playwright/test");
(async (slug) => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://localhost:4173/blog/' + slug, { waitUntil: 'networkidle' });
  await p.waitForSelector('body');
  await p.waitForTimeout(2400);
  const h = await p.evaluate(() => {
    const nodes = Array.from(document.querySelectorAll('*'));
    const n = nodes.find(n => /\\bBy\\b/.test(n.textContent || '') && /Marica/.test(n.textContent || ''));
    return n ? n.outerHTML : null;
  });
  console.log(h || 'NOT_FOUND');
  await b.close();
})(process.argv[2]);
