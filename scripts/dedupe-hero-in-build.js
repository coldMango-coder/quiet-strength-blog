#!/usr/bin/env node
/*
  Sweep build/*.html and remove duplicate inline hero images and their small italic captions.
  Logic mirrors runtime hook useHeroImageDeduper, but operates on static HTML with JSDOM.
*/

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p, acc);
    } else if (entry.isFile() && p.endsWith('.html')) {
      acc.push(p);
    }
  }
  return acc;
}

function normalizeSrc(u) {
  try {
    if (!u) return '';
    const a = new URL(u, 'https://trueallyguide.com');
    const last = (a.pathname || '').toLowerCase().split('/').filter(Boolean).pop() || '';
    return decodeURIComponent(last);
  } catch {
    return '';
  }
}

function collectUrlsFromPicture(rootEl) {
  const urls = new Set();
  if (!rootEl) return urls;
  const img = rootEl.tagName === 'IMG' ? rootEl : rootEl.querySelector('img');
  if (img) {
    const s = img.getAttribute('src');
    if (s) urls.add(s);
    const cs = img.getAttribute('src') || '';
    if (cs) urls.add(cs);
  }
  rootEl.querySelectorAll('source[srcset]').forEach((s) => {
    const ss = s.getAttribute('srcset') || '';
    ss.split(',').map((x) => (x || '').trim().split(' ')[0]).forEach((url) => { if (url) urls.add(url); });
  });
  return urls;
}

function looksLikeCaptionEl(el) {
  if (!el) return false;
  const tag = (el.tagName || '').toLowerCase();
  if (tag === 'figcaption') return true;
  try {
    if (typeof el.matches !== 'function') return false;
    return (
      el.matches('p.text-sm.text-gray-600.text-center.italic') ||
      el.matches('p.text-sm.text-gray-600.italic.text-center') ||
      el.matches('p.text-sm.text-center.italic') ||
      el.matches('p.text-xs.text-center.italic') ||
      el.matches('p.italic.text-center') ||
      el.matches('em.caption')
    );
  } catch {
    return false;
  }
}

function processFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const dom = new JSDOM(html);
  const d = dom.window.document;

  const hero = d.querySelector('section#intro-media') || d.querySelector('#post-hero')?.closest('section') || d.querySelector('#post-hero');
  if (!hero) return false;

  const root = d.querySelector('.prose') || d.querySelector('.post-body') || d.body;
  if (!root) return false;

  const prose = root.classList?.contains('prose') ? root : (root.querySelector('.prose') || root);

  // 1) Structural cleanup (URL-independent): remove only div.my-8 inside prose
  // that contains a hero-like image (picture or img) AND a descendant caption paragraph
  // whose classList includes ALL of: text-sm, text-gray-600, text-center, italic
  let changed = false;
  Array.from(prose.querySelectorAll('div.my-8')).forEach((block) => {
    if (!block) return;
    if (hero && hero.contains(block)) return; // never touch real hero
    const heroLike = block.querySelector('picture, img');
    if (!heroLike) return;
    let hasCaption = false;
    const required = ['text-sm', 'text-gray-600', 'text-center', 'italic'];
    Array.from(block.querySelectorAll('p')).some((p) => {
      try {
        const cl = p.classList;
        if (cl && required.every((t) => cl.contains(t))) { hasCaption = true; return true; }
      } catch {}
      return false;
    });
    if (!hasCaption) return;
    // This block matches the duplicate hero pattern; remove the whole block
    if (block.parentNode) { block.parentNode.removeChild(block); changed = true; }
  });

  const heroUrls = new Set();
  hero.querySelectorAll('picture, img').forEach((node) => {
    collectUrlsFromPicture(node).forEach((u) => heroUrls.add(normalizeSrc(u)));
  });
  if (heroUrls.size === 0) {
    if (changed) {
      fs.writeFileSync(filePath, '<!DOCTYPE html>\n' + d.documentElement.outerHTML);
      return true;
    }
    return false;
  }

  const candidates = Array.from(prose.querySelectorAll('picture, img'));
  // changed may already be true from structural pass
  for (const node of candidates) {
    if (!node) continue;
    if (hero.contains(node)) continue; // never remove from hero
    const urls = collectUrlsFromPicture(node);
    const isMatch = Array.from(urls).some((u) => heroUrls.has(normalizeSrc(u)));
    if (!isMatch) continue;

    const container = node.closest('div.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full') ||
      node.closest('div.overflow-hidden.rounded-lg.shadow-md.my-8') ||
      node.closest('div.relative.overflow-hidden.rounded-lg.shadow-md.w-full') ||
      node.closest('div.my-8') ||
      node.closest('figure.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full') ||
      node.closest('figure.overflow-hidden.rounded-lg.shadow-md.my-8') ||
      node;
    const next = container?.nextElementSibling;
    const prev = container?.previousElementSibling;
    if (container && container.parentNode) { container.parentNode.removeChild(container); changed = true; }
    if (looksLikeCaptionEl(next) && next.parentNode) { next.parentNode.removeChild(next); changed = true; }
    if (looksLikeCaptionEl(prev) && prev.parentNode) { prev.parentNode.removeChild(prev); changed = true; }
  }

  if (changed) {
    fs.writeFileSync(filePath, '<!DOCTYPE html>\n' + d.documentElement.outerHTML);
  }
  return changed;
}

function main() {
  const buildDir = path.join(__dirname, '..', 'build');
  if (!fs.existsSync(buildDir)) {
    console.error('build/ not found; run the build first.');
    process.exit(1);
  }
  const files = walk(buildDir);
  let modified = 0;
  files.forEach((f) => { if (processFile(f)) modified++; });
  console.log(`Hero dedupe sweep complete. Processed ${files.length} HTML files, modified ${modified}.`);
}

if (require.main === module) main();
