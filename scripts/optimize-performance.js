const fs = require('fs-extra');
const path = require('path');

const BUILD_DIR = path.join(__dirname, '../build');

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

    // Minify HTML
    for (const file of htmlFiles) {
      const filePath = path.join(BUILD_DIR, file);
      const content = await fs.readFile(filePath, 'utf8');
      const minified = content.replace(/>\s+</g, '><').replace(/\s+/g, ' ').trim();
      await fs.writeFile(filePath, minified);
    }

    // Preload + deblock main resources
    const assetManifest = await fs.readJson(path.join(BUILD_DIR, 'asset-manifest.json'));
    const preloadHints = `\n<!-- Performance: Critical resource preloads -->\n<link rel="preload" href="${assetManifest.files['main.css']}" as="style">\n<link rel="preload" href="${assetManifest.files['main.js']}" as="script">\n<link rel="modulepreload" href="${assetManifest.files['main.js']}">`;

    for (const file of htmlFiles) {
      const filePath = path.join(BUILD_DIR, file);
      let content = await fs.readFile(filePath, 'utf8');
      content = content.replace(/<meta name="theme-color"[^>]*>/, (m) => m + preloadHints);
      if (!/onload=\"this\.onload=null;this\.rel='stylesheet'\"/.test(content)) {
        content = content.replace(
          /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']*main[^"']*\.css)["'][^>]*>/i,
          (m, href) => `<link rel="preload" as="style" href="${href}" onload=\"this.onload=null;this.rel='stylesheet'\"><noscript><link rel=\"stylesheet\" href=\"${href}\"></noscript>`
        );
      }
      await fs.writeFile(filePath, content);
    }

    // Optional: annotate sitemap if present
    const sitemapPath = path.join(BUILD_DIR, 'sitemap.xml');
    if (await fs.pathExists(sitemapPath)) {
      let sitemap = await fs.readFile(sitemapPath, 'utf8');
      sitemap = sitemap.replace(/<sitemap>/, `<sitemap>\n<!-- Generated with performance optimizations -->`);
      await fs.writeFile(sitemapPath, sitemap);
    }

    // Report
    const report = {
      timestamp: new Date().toISOString(),
      htmlFilesOptimized: htmlFiles.length,
      staticAssets: Object.keys(assetManifest.files).length,
    };
    await fs.writeJson(path.join(BUILD_DIR, 'performance-report.json'), report, { spaces: 2 });
    console.log('Performance optimization complete.');
  } catch (e) {
    console.error('Performance optimization failed:', e);
    process.exit(1);
  }
}

optimizePerformance();