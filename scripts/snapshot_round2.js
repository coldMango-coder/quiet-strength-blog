const { chromium } = require('@playwright/test');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.setViewportSize({ width: 1280, height: 900 });
  page.setDefaultTimeout(30000);

  // Expanded state (default)
  await page.goto('http://localhost:4173/blog/how-to-say-no-without-guilt', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.qs-toc .toc-shell, .qs-toc .modern-toc', { state: 'attached' });
  await page.waitForTimeout(400);
  const expandedHtml = await page.$eval('.qs-toc', el => el.outerHTML);
  const expandedOverflow = await page.$eval('.qs-toc .toc-shell', el => {
    const cs = getComputedStyle(el);
    return { overflowX: cs.overflowX, overflowY: cs.overflowY };
  }).catch(() => ({ overflowX: 'n/a', overflowY: 'n/a' }));

  // Collapsed state via query param
  await page.goto('http://localhost:4173/blog/how-to-say-no-without-guilt?toc=collapsed', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.qs-toc .toc-shell, .qs-toc .modern-toc', { state: 'attached' });
  await page.waitForTimeout(200);
  const collapsedHtml = await page.$eval('.qs-toc', el => el.outerHTML);

  // Byline snippet on expanded page\n  const slugs = [\n    'how-to-say-no-without-guilt',\n    'introvert-networking-tips-without-small-talk-guide',\n    'how-to-be-confident-as-an-introvert-woman-guide'\n  ];\n  let bylineHtml = null;\n  for (const s of slugs) {\n    await page.goto(http://localhost:4173/blog/, { waitUntil: 'domcontentloaded' });\n    bylineHtml = await page.evaluate(() => {\n      const nodes = Array.from(document.querySelectorAll('*'));\n      const n = nodes.find(n => /\\bBy\\b/.test(n.textContent || '') && /Marica\\s+.*inko/i.test(n.textContent || ''));\n      return n ? n.outerHTML : null;\n    });\n    if (bylineHtml) break;\n  }\n\n  console.log('---BYLINE_HTML---');\n  console.log(bylineHtml || 'NOT_FOUND');

  // Homepage themes grid
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.themes-grid');
  const themesOuter = await page.$eval('.themes-grid', el => el.outerHTML);
  const gridCSS = await page.$eval('.themes-grid', el => {
    const cs = getComputedStyle(el);
    return { display: cs.display, columnGap: cs.columnGap, rowGap: cs.rowGap };
  });
  const cardPositions = await page.$$eval('.theme-card', els => els.slice(0,3).map(el => getComputedStyle(el).position));
  console.log('---THEMES_GRID_OUTER_START---');
  console.log(themesOuter);
  console.log('---THEMES_GRID_OUTER_END---');
  console.log('---THEMES_GRID_CSS---');
  console.log(JSON.stringify({ gridCSS, cardPositions }));

  await browser.close();
})();
