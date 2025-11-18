const { chromium } = require("@playwright/test");
(async (slug) => {
  const b = await chromium.launch();
  const p = await b.newPage();
  await p.goto('http://localhost:4173/blog/' + slug, { waitUntil: 'networkidle' });
  const h = await p.evaluate(() => {
    const m = document.querySelector('meta[name="author"]');
    return m ? m.outerHTML : null;
  });
  console.log(h || 'NOT_FOUND');
  await b.close();
})(process.argv[2]);
