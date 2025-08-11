import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function transformFooterButtons(htmlContent) {
  // Transform button elements with data-link attributes to proper anchor tags
  let transformed = htmlContent
    // Transform buttons to anchors for navigation
    .replace(/<button([^>]*?)data-link=["']([^"']+)["'][^>]*>(.*?)<\/button>/gi, (match, attrs, href, content) => {
      // Clean attributes, remove data-link and add proper href
      const cleanAttrs = attrs.replace(/\s*data-link=["'][^"']*["']/gi, '').trim();
      return `<a href="${href}"${cleanAttrs ? ' ' + cleanAttrs : ''} role="button">${content}</a>`;
    })
    // Also handle self-closing button style
    .replace(/<button([^>]*?)data-link=["']([^"']+)["'][^>]*\/>/gi, (match, attrs, href) => {
      const cleanAttrs = attrs.replace(/\s*data-link=["'][^"']*["']/gi, '').trim();
      return `<a href="${href}"${cleanAttrs ? ' ' + cleanAttrs : ''} role="button"></a>`;
    });
  
  return transformed;
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
      const transformed = transformFooterButtons(content);
      
      if (transformed !== content) {
        fs.writeFileSync(fullPath, transformed);
        console.log(`Transformed footer buttons in: ${fullPath}`);
      }
    }
  }
}

// Process all HTML files in the build directory
processHtmlFiles(path.join(__dirname, '..', 'build'));