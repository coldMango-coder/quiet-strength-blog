#!/usr/bin/env node
/* eslint-disable no-console */
// Postbuild sweep: remove duplicate hero images in built HTML files using cheerio

const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(p, acc);
    else if (entry.isFile() && p.endsWith('.html')) acc.push(p);
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

function collectUrlsFromPicture($, rootEl) {
  const urls = new Set();
  if (!rootEl || rootEl.length === 0) return urls;
  const img = rootEl.is('img') ? rootEl : rootEl.find('img').first();
  if (img && img.length) {
    const s = img.attr('src');
    if (s) urls.add(s);
  }
  rootEl.find('source[srcset]').each((_, el) => {
    const ss = ($(el).attr('srcset') || '').split(',');
    ss.map((x) => (x || '').trim().split(' ')[0]).forEach((u) => { if (u) urls.add(u); });
  });
  return urls;
}

function looksLikeCaption($, $el) {
  if (!$el || !$el.length) return false;
  const tag = ($el[0].tagName || '').toLowerCase();
  if (tag === 'figcaption') return true;
  // Common caption paragraph variants
  return (
    $el.is('p.text-sm.text-gray-600.text-center.italic') ||
    $el.is('p.text-sm.text-gray-600.italic.text-center') ||
    $el.is('p.text-sm.text-center.italic') ||
    $el.is('p.text-xs.text-center.italic') ||
    $el.is('p.italic.text-center') ||
    $el.is('em.caption')
  );
}

function processFile(filePath) {
  const html = fs.readFileSync(filePath, 'utf8');
  const $ = cheerio.load(html, { decodeEntities: false });

  const hero = $('section#intro-media');
  if (!hero.length) return false;

  const ctx = $('.prose').first().length ? $('.prose').first() : ($('.post-body').first().length ? $('.post-body').first() : $('article').first());
  if (!ctx || !ctx.length) return false;
  const $root = $.root();

  let changed = false;

  // Remove duplicate hero blocks inside the article body: div.my-8 with hero-like image + caption
  $root.find('.prose div.my-8').each((_, el) => {
    const $block = $(el);

    // Safety: do not remove anything inside the hero section
    if (hero.length && (hero.find(el).length || (hero[0] && $.contains(hero[0], el)))) return;

    const $heroLike = $block.find('picture, img').first();
    if (!$heroLike.length) return;

    // Must contain a caption paragraph whose class list includes:
    // text-sm, text-gray-600, italic, text-center
    const $caption = $block.find('p').first();
    if (!$caption.length) return;
    const classAttr = $caption.attr('class') || '';
    const classes = classAttr.trim().split(/\s+/).filter(Boolean);
    const has = (name) => classes.includes(name);
    if (!(has('text-sm') && has('text-gray-600') && has('italic') && has('text-center'))) return;

    // This block is the duplicate hero + caption in the body
    $block.before('<!-- deduped:inline-hero-block -->');
    $block.remove();

    // (No need to separately remove caption; it's inside $block)
    changed = true;
  });

  // Build hero URL set for reliable matching (fallback pass)
  const heroUrls = new Set();
  hero.find('picture, img').each((_, el) => {
    collectUrlsFromPicture($, $(el)).forEach((u) => heroUrls.add(normalizeSrc(u)));
  });

  if (heroUrls.size === 0) {
    if (changed) {
      fs.writeFileSync(filePath, $.html());
      return true;
    }
    return false;
  }

  // Gather candidates inside prose (excluding hero subtree)
  $root.find('.prose picture, .prose img').each((_, el) => {
    const $el = $(el);
    if (hero.find(el).length) return; // node is inside hero

    const urls = collectUrlsFromPicture($, $el);
    const isMatch = Array.from(urls).some((u) => heroUrls.has(normalizeSrc(u)));
    if (!isMatch) return;

    // Prefer removing generic known wrapper containers; fall back to the node itself
    let $container = $el.closest('div.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full');
    if (!$container.length) { $container = $el.closest('div.overflow-hidden.rounded-lg.shadow-md.my-8'); }
    if (!$container.length) { $container = $el.closest('div.relative.overflow-hidden.rounded-lg.shadow-md.w-full'); }
    if (!$container.length) { $container = $el.closest('div.my-8'); }
    if (!$container.length) { $container = $el.closest('figure.relative.overflow-hidden.rounded-lg.shadow-md.my-8.w-full'); }
    if (!$container.length) { $container = $el.closest('figure.overflow-hidden.rounded-lg.shadow-md.my-8'); }
    if (!$container.length) { $container = $el.closest('picture.overflow-hidden.rounded-lg.shadow-md.my-8.w-full'); }
    if (!$container.length) { $container = $el.closest('picture.rounded-lg.shadow-md.my-8.w-full'); }
    if (!$container.length) $container = $el;

    // Mark and remove container
    $container.before('<!-- deduped:hero -->');
    $container.remove();
    changed = true;

    // Remove adjacent captions if present
    const $next = $container.next();
    const $prev = $container.prev();
    if (looksLikeCaption($, $next)) { $next.before('<!-- deduped:hero-caption -->'); $next.remove(); }
    if (looksLikeCaption($, $prev)) { $prev.before('<!-- deduped:hero-caption -->'); $prev.remove(); }
  });

  if (changed) {
    fs.writeFileSync(filePath, $.html());
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
  console.log(`Hero dedupe (cheerio) complete. Processed ${files.length} HTML files, modified ${modified}.`);
}

if (require.main === module) main();
