import fs from 'fs';
import path from 'path';
import { JSDOM } from 'jsdom';

const host = process.env.HOST;
const slugs = (process.env.SLUGS || '').split(',').filter(Boolean);

const src = fs.readFileSync('build/index.html', 'utf8');

for (const s of slugs) {
  const dom = new JSDOM(src);
  const d = dom.window.document;

  // Remove any existing canonical and set the exact one for this path
  d.querySelectorAll("link[rel='canonical']").forEach(n => n.remove());
  const can = d.createElement('link');
  can.rel = 'canonical';
  can.href = host + s;
  d.head.appendChild(can);

  // Ensure main CSS loads unconditionally (no print-swap for emergency first-paint styling)
  const cssLink = d.querySelector('link[rel="stylesheet"][href*="/static/css/"]');
  if (cssLink) {
    cssLink.removeAttribute('media');
    cssLink.removeAttribute('onload');
  }

  const out = path.join('build', s.replace(/^\//, ''));
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), '<!DOCTYPE html>\n' + d.documentElement.outerHTML);
}
