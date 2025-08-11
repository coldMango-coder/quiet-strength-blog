import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function addLcpPreloads(htmlContent, filePath) {
  // Add preload hints for critical images that would be LCP candidates
  let optimized = htmlContent;
  
  // For blog posts, preload the hero image
  if (filePath.includes('/blog/') && filePath.includes('/index.html')) {
    // Look for first image in content and preload it
    const imgMatch = optimized.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
    if (imgMatch) {
      const imgSrc = imgMatch[1];
      const preloadLink = `<link rel="preload" as="image" fetchpriority="high" href="${imgSrc}"/>`;
      optimized = optimized.replace(/<\/head>/i, `${preloadLink}\n</head>`);
    }
  }
  
  // Defer non-critical analytics scripts
  optimized = optimized
    .replace(/src=["']https:\/\/www\.googletagmanager\.com[^"']*["']/g, 
      'data-src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID" defer')
    .replace(/src=["']https:\/\/analytics\.ahrefs\.com[^"']*["']/g, 
      'data-src="https://analytics.ahrefs.com/analytics.js" defer');
  
  return optimized;
}

function processHtmlFiles(dir) {
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stats = fs.statSync(fullPath);
    
    if (stats.isDirectory()) {
      processHtmlFiles(fullPath);
    } else if (path.extname(item) === '.html') {
      const content = fs.readFileSync(fullPath, 'utf8');
      const optimized = addLcpPreloads(content, fullPath);
      
      if (optimized !== content) {
        fs.writeFileSync(fullPath, optimized);
        console.log(`Added LCP optimizations to: ${fullPath}`);
      }
    }
  }
}

// Process all HTML files in the build directory
processHtmlFiles(path.join(__dirname, '..', 'build'));