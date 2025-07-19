// generate-sitemap.js
import SitemapGenerator from 'sitemap-generator';
import path from 'path';
import fs from 'fs';

// --- 1. build directory to crawl (CRA outputs to build/) ---
const distFolder = path.resolve('build');

// --- 2. your production domain ---
const siteUrl = 'https://trueallyguide.com';

// --- 3. run the generator ---
const generator = SitemapGenerator(siteUrl, {
  stripQuerystring: false,
  filepath: path.join(distFolder, 'sitemap.xml'),
  maxDepth: 0,
});

// start the crawler
generator.start();

// log
generator.on('done', () => {
  console.log('Sitemap generated at build/sitemap.xml');
});
