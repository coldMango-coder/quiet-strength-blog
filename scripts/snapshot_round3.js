const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Desktop expanded snapshot
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('http://localhost:4173/blog/how-to-say-no-without-guilt', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.qs-toc .toc-shell, .qs-toc nav', { state: 'attached' });
  const tocExpanded = await page.$eval('.qs-toc', el => el.outerHTML);
  const overflowExpanded = await page.$eval('.qs-toc .toc-shell', el => { const cs = getComputedStyle(el); return { position: cs.position, overflowY: cs.overflowY }; }).catch(() => ({ position: 'n/a', overflowY: 'n/a' }));

  // Mobile collapsed snapshot (sticky disabled)
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto('http://localhost:4173/blog/how-to-say-no-without-guilt?toc=collapsed', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.qs-toc .toc-shell');
  const tocCollapsed = await page.$eval('.qs-toc', el => el.outerHTML);
  const csMobile = await page.$eval('.qs-toc .toc-shell', el => { const cs = getComputedStyle(el); return { position: cs.position, top: cs.top, overflowY: cs.overflowY }; });

  // Byline on two posts (build-time fixed + safety normalizer)
  const slugs = ['how-to-say-no-without-guilt', 'how-to-be-confident-as-an-introvert-woman-guide'];
  const bylines = [];
  for (const s of slugs) {
    await page.goto(`http://localhost:4173/blog/${s}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(300);
    const b = await page.evaluate(() => {
      const nodes = Array.from(document.querySelectorAll('*'));
      const n = nodes.find(n => /\bBy\b/.test(n.textContent || '') && /Marica\s+Šinko/.test(n.textContent || ''));
      return n ? n.outerHTML : null;
    });
    bylines.push({ slug: s, html: b });
  }

  // Themes grid computed styles
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.themes-grid');
  const themesOuter = await page.$eval('.themes-grid', el => el.outerHTML);
  const themesCSS = await page.$eval('.themes-grid', el => { const cs = getComputedStyle(el); return { display: cs.display, columnGap: cs.columnGap, rowGap: cs.rowGap }; });
  const cardPos = await page.$$eval('.theme-card', els => els.slice(0,3).map(el => getComputedStyle(el).position));

  console.log('---ROUND3_TOC_EXPANDED---');
  console.log(tocExpanded);
  console.log('---ROUND3_TOC_OVERFLOW_DESKTOP---');
  console.log(JSON.stringify(overflowExpanded));
  console.log('---ROUND3_TOC_COLLAPSED_MOBILE---');
  console.log(tocCollapsed);
  console.log('---ROUND3_TOC_COMPUTED_MOBILE---');
  console.log(JSON.stringify(csMobile));
  console.log('---ROUND3_BYLINES---');
  console.log(JSON.stringify(bylines));
  console.log('---ROUND3_THEMES_OUTER---');
  console.log(themesOuter);
  console.log('---ROUND3_THEMES_CSS---');
  console.log(JSON.stringify({ themesCSS, cardPos }));

  await browser.close();
})();
