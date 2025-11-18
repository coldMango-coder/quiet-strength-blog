#!/usr/bin/env node
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import puppeteer from 'puppeteer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const buildDir = path.join(__dirname, '..', 'build');
  app.use(express.static(buildDir));
  app.get(/.*/, (req, res) => res.sendFile(path.join(buildDir, 'index.html')));
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      resolve({ server, port });
    });
  });
}

async function run() {
  const { server, port } = await startServer();
  const base = `http://localhost:${port}`;
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();

  const results = {};

  // 1) Archive grid: relationships-and-dating
  await page.goto(`${base}/category/relationships-and-dating`, { waitUntil: 'networkidle0' });
  results.archiveGrid = await page.evaluate(() => {
    const grid = document.querySelector('.archive-grid');
    const firstCard = document.querySelector('.archive-grid .post-card');
    const cs = grid ? getComputedStyle(grid) : null;
    const csCard = firstCard ? getComputedStyle(firstCard) : null;
    const container = document.querySelector('.container-wide, .max-w-7xl');
    const csContainer = container ? getComputedStyle(container) : null;
    return {
      gridExists: !!grid,
      gridDisplay: cs?.display,
      gridGap: cs?.gap || `${cs?.rowGap} ${cs?.columnGap}`,
      cardPosition: csCard?.position,
      hasMaxW7xl: !!document.querySelector('.max-w-7xl'),
      archiveMaxWidth: csContainer?.maxWidth || null,
    };
  });

  // 2) About author avatar outerHTML
  await page.goto(`${base}/about`, { waitUntil: 'networkidle0' });
  results.authorAvatar = await page.evaluate(() => {
    const img = document.querySelector('img[alt*="Marica"]');
    return img ? img.outerHTML : null;
  });

  // 3) Blog byline outerHTML on first 3 posts (best-effort)
  const slugs = [
    'how-to-stop-attracting-narcissists-9-proven-strategies',
    'introvert-networking-tips-without-small-talk-guide',
    'how-to-be-confident-as-an-introvert-woman-guide',
  ];
  results.bylines = [];
  for (const slug of slugs) {
    await page.goto(`${base}/blog/${slug}`, { waitUntil: 'networkidle0' });
    const outer = await page.evaluate(() => {
      const header = document.querySelector('article header');
      return header ? header.outerHTML : document.body.outerHTML.slice(0, 1000);
    });
    results.bylines.push({ slug, headerOuterHTML: outer });
  }

  // 3b) AuthorBio avatar on a blog post
  await page.goto(`${base}/blog/${slugs[0]}`, { waitUntil: 'networkidle0' });
  results.authorBioAvatar = await page.evaluate(() => {
    const img = document.querySelector('aside img[alt*="Marica"]');
    return img ? img.outerHTML : null;
  });

  // 4) Article image mobile full-width check (emulate mobile viewport)
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(`${base}/blog/how-to-be-confident-as-an-introvert-woman-guide`, { waitUntil: 'networkidle0' });
  results.articleImageMobile = await page.evaluate(() => {
    const img = document.querySelector('.article-container img, article img');
    if (!img) return null;
    const imgCS = getComputedStyle(img);
    const w = img.getBoundingClientRect().width;
    const container = document.querySelector('.article-container, article');
    const cw = container ? container.getBoundingClientRect().width : null;
    return {
      imgOuterHTML: img.outerHTML,
      imgComputedWidth: w,
      containerWidth: cw,
      cssWidth: imgCS.width,
    };
  });

  // 5) Home latest posts parity + grid + list snapshot
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(base + '/', { waitUntil: 'networkidle0' });
  results.latestPosts = await page.evaluate(() => {
    const latest = document.querySelector('#latest');
    const containerComputed = latest ? getComputedStyle(latest) : null;
    const featured = latest?.querySelector('article');
    const img = featured?.querySelector('img');
    const grid = latest?.querySelector('#latest .latest-grid');
    const gridCS = grid ? getComputedStyle(grid) : null;
    const footer = document.querySelector('footer .container'); const footerCS = footer ? getComputedStyle(footer) : null; return { latestHasContainerWide: latest?.classList.contains('container-wide') || false, latestMaxWidth: containerComputed?.maxWidth || null, footerMaxWidth: footerCS?.maxWidth || null, gridTemplateColumns: gridCS?.gridTemplateColumns || null, featuredHTML: featured?.outerHTML || null, imgHTML: img?.outerHTML || null, imgSize: img ? { w: img.getAttribute('width'), h: img.getAttribute('height') } : null, latestItemCount: (latest?.querySelectorAll('.mini-list li') || []).length, titleLineClamp: (latest?.querySelector('.mini-list .title') ? getComputedStyle(latest.querySelector('.mini-list .title')).webkitLineClamp : null), excerptLineClamp: (latest?.querySelector('.mini-list p') ? getComputedStyle(latest.querySelector('.mini-list p')).webkitLineClamp : null), };
  });

  // Themes container and card sizing
  results.themes = await page.evaluate(() => {
    const section = document.querySelector('#themes .container-wide');
    const card = document.querySelector('#themes .theme-card');
    const csCard = card ? getComputedStyle(card) : null;
    return {
      themesHasContainerWide: !!section,
      themeCardMinHeight: csCard?.minHeight || null,
    };
  });

  // 6) TOC details/summary present and alignment (compare first/last li)
  await page.goto(`${base}/blog/${slugs[0]}`, { waitUntil: 'networkidle0' });
  results.toc = await page.evaluate(() => {
    const details = document.querySelector('details.toc-shell');
    const summary = details?.querySelector('summary');
    const list = details?.querySelector('.toc-list');
    const firstLi = list?.querySelector('li'); const lastLi = list?.querySelector('li:last-child');
    const csList = list ? getComputedStyle(list) : null;
    const csFirst = firstLi ? getComputedStyle(firstLi) : null; const csLast = lastLi ? getComputedStyle(lastLi) : null;
    const hideBtn = Array.from(document.querySelectorAll('button')).find(b => /hide\s*toc/i.test(b.textContent || ''));
    return { hasDetails: !!details, hasSummary: !!summary, hasHideButton: !!hideBtn, tocPaddingLeft: csList?.paddingLeft || null, tocFirstLiMarginLeft: csFirst?.marginLeft || null, tocLastLiMarginLeft: csLast?.marginLeft || null, tocFirstLiPaddingLeft: csFirst?.paddingLeft || null, tocLastLiPaddingLeft: csLast?.paddingLeft || null, };
  });

  console.log(JSON.stringify(results, null, 2));
  await browser.close();
  server.close();
}

run().catch((e) => { console.error(e); process.exit(1); });





