// generate-sitemap.js
import SitemapGenerator from 'sitemap-generator';
import path from 'path';

// 1.  where the XML should be written
const distFolder = path.resolve('build');
const siteUrl = 'https://trueallyguide.com';

// 2.  list every route you want in the sitemap
const extraPaths = [
  '/',                                      // home
  '/about',
  '/blog',
  '/blog/preventing-introvert-burnout',
  '/blog/productivity-for-introverts',
  // add more as you publish
];

// 3.  init generator (but don't start yet)
const generator = SitemapGenerator(siteUrl, {
  filepath: path.join(distFolder, 'sitemap.xml'),
  stripQuerystring: false,
  maxDepth: 0,
});

// 4.  queue your routes
extraPaths.forEach(p => generator.queueURL(`${siteUrl}${p}`));

// 5.  crawl + write
generator.start();

generator.on('done', () => {
  console.log('Sitemap generated at build/sitemap.xml');
});
