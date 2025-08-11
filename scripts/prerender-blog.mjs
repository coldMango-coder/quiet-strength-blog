/* Build-time static HTML generator for blog posts */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const host = process.env.CAN_HOST || 'https://www.trueallyguide.com';
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/posts.json'), 'utf8'));

// Check if we have a blog template, if not create basic one
const templatePath = path.join(__dirname, '../public/templates/blog.html');
let tmpl;

try {
  tmpl = fs.readFileSync(templatePath, 'utf8');
} catch (err) {
  console.log('Creating blog template...');
  // Create templates directory
  fs.mkdirSync(path.join(__dirname, '../public/templates'), { recursive: true });
  
  // Basic blog template
  tmpl = `<!DOCTYPE html><html lang='en'><head><meta charset='utf-8'/><link rel='icon' href='/favicon.ico'/><meta name='viewport' content='width=device-width, initial-scale=1'/><meta name='theme-color' content='#C05621'/><meta name='description' content='__DESC__'/><link rel='canonical' href='__CAN__'/><meta property='og:url' content='__CAN__'/><meta property='og:title' content='__TITLE__'/><meta property='og:description' content='__DESC__'/><meta property='og:image' content='__OGIMG__'/><script type='application/ld+json'>__JSONLD__</script><title>__TITLE__</title><link rel='preload' as='style' href='/static/css/main.css' onload='this.onload=null;this.rel="stylesheet"'><noscript><link rel='stylesheet' href='/static/css/main.css'></noscript></head><body><div id='root'></div><script defer src='/static/js/main.js'></script></body></html>`;
  
  fs.writeFileSync(templatePath, tmpl);
}

for (const p of posts) {
  const html = tmpl
    .replace(/__TITLE__/g, p.title)
    .replace(/__DESC__/g, p.description)
    .replace(/__CAN__/g, host + p.path)
    .replace(/__OGIMG__/g, host + p.ogImage)
    .replace(/__JSONLD__/g, JSON.stringify(p.jsonld));
  
  const outDir = path.join(__dirname, '../build', p.path);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html);
  
  console.log(`✅ Generated ${p.path}`);
}

console.log(`🎉 Generated ${posts.length} blog post pages`);