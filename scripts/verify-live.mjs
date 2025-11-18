#!/usr/bin/env node
import puppeteer from 'puppeteer';

const PROD = process.env.PROD_URL || 'https://quiet-strength-blog-plbo-2v8ly0m3m-mangos-projects-e814ad8c.vercel.app';

async function checkLatest(page, base){
  await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
  await page.goto(base + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  return await page.evaluate(() => {
    const latest = document.querySelector('#latest');
    const containerComputed = latest ? getComputedStyle(latest) : null;
    const grid = latest?.querySelector('#latest .latest-grid');
    const gridCS = grid ? getComputedStyle(grid) : null;
    const footer = document.querySelector('footer .container');
    const footerCS = footer ? getComputedStyle(footer) : null;
    return {
      latestHasContainerWide: latest?.classList.contains('container-wide') || latest?.classList.contains('qs-container') || false,
      latestMaxWidth: containerComputed?.maxWidth || null,
      footerMaxWidth: footerCS?.maxWidth || null,
      gridTemplateColumns: gridCS?.gridTemplateColumns || null,
      latestItemCount: (latest?.querySelectorAll('.mini-list li') || []).length,
    };
  });
}

async function checkTOC(page, base){
  await page.goto(base + '/blog/how-to-be-confident-as-an-introvert-woman-guide', { waitUntil: 'networkidle2', timeout: 60000 });
  return await page.evaluate(() => {
    const details = document.querySelector('details.toc-shell');
    const list = details?.querySelector('.toc-list');
    const firstLi = list?.querySelector('li');
    const lastLi = list?.querySelector('li:last-child');
    const csList = list ? getComputedStyle(list) : null;
    const csFirst = firstLi ? getComputedStyle(firstLi) : null;
    const csLast = lastLi ? getComputedStyle(lastLi) : null;
    return {
      tocPaddingLeft: csList?.paddingLeft || null,
      tocFirstLiPaddingLeft: csFirst?.paddingLeft || null,
      tocLastLiPaddingLeft: csLast?.paddingLeft || null,
    };
  });
}

async function checkMobileHero(page, base){
  await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 2, isMobile: true });
  await page.goto(base + '/', { waitUntil: 'networkidle2', timeout: 60000 });
  return await page.evaluate(() => {
    const featuredImg = document.querySelector('#latest .featured-card img');
    const r = featuredImg ? featuredImg.getBoundingClientRect() : null;
    const ratio = r ? (r.width && r.height ? (r.width / r.height) : null) : null;
    const title = document.querySelector('#latest .featured-card h3');
    const titleCS = title ? getComputedStyle(title) : null;
    return { aspectApprox: ratio, titleFontSize: titleCS?.fontSize || null };
  });
}

async function run(){
  const browser = await puppeteer.launch({ args: ['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  try {
    const latest = await checkLatest(page, PROD);
    const toc = await checkTOC(page, PROD);
    const mobile = await checkMobileHero(page, PROD);
    console.log(JSON.stringify({ latest, toc, mobile }, null, 2));
  } catch (e) {
    console.error('Live verify failed:', e.message);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

run();

