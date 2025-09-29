const fs = require('fs-extra');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '..', 'build');

function listHtmlFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(current, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && p.endsWith('.html')) out.push(path.relative(dir, p));
    }
  }
  return out;
}

async function optimizePerformance() {
  console.log('Starting performance optimization...');
  try {
    const htmlFiles = listHtmlFiles(BUILD_DIR);

    // Minify HTML only (safe)
    for (const file of htmlFiles) {
      const filePath = path.join(BUILD_DIR, file);
      const content = await fs.readFile(filePath, 'utf8');
      const minified = content.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
      await fs.writeFile(filePath, minified);
    }

    // Add safe resource hints and non-blocking CSS for main bundle
    try {
      const manifest = await fs.readJson(path.join(BUILD_DIR, 'asset-manifest.json'));
      const mainCss = manifest.files && manifest.files['main.css'];
      const mainJs = manifest.files && manifest.files['main.js'];
      if (mainCss || mainJs) {
        for (const file of htmlFiles) {
          const filePath = path.join(BUILD_DIR, file);
          let content = await fs.readFile(filePath, 'utf8');

          // Insert preload hints after theme-color meta
          const hints = [
            mainCss ? `<link rel="preload" href="${mainCss}" as="style">` : '',
            mainJs ? `<link rel="preload" href="${mainJs}" as="script">` : '',
            mainJs ? `<link rel="modulepreload" href="${mainJs}">` : ''
          ].filter(Boolean).join('');
          content = content.replace(/<meta name="theme-color"[^>]*>/, (m) => m + hints);

          // Transform blocking main.css link to non-blocking (idempotent)
          if (!/onload=\"this\.onload=null;this\.rel='stylesheet'\"/.test(content)) {
            content = content.replace(
              /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']*main[^"']*\.css)["'][^>]*>/i,
              (m, href) =>
                `<link rel="preload" as="style" href="${href}" onload=\"this.onload=null;this.rel='stylesheet'\">` +
                `<noscript><link rel="stylesheet" href="${href}"></noscript>`
            );
          }

          await fs.writeFile(filePath, content);
        }
      }
    } catch {}

    // Optional: annotate sitemap
    const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');
    if (await fs.pathExists(sitemapPath)) {
      let sitemap = await fs.readFile(sitemapPath, 'utf8');
      sitemap = sitemap.replace(/<sitemap>/, '<sitemap>\n<!-- Generated with performance optimizations -->');
      await fs.writeFile(sitemapPath, sitemap);
    }

    const report = {
      timestamp: new Date().toISOString(),
      htmlFilesOptimized: htmlFiles.length
    };
    await fs.writeJson(path.join(BUILD_DIR, 'performance-report.json'), report, { spaces: 2 });
    console.log('Performance optimization complete.');
  } catch (e) {
    console.error('Performance optimization failed:', e);
    process.exit(1);
  }
}

optimizePerformance();
