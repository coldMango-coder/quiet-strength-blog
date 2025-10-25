// Apply canonicals for homepage, blog, categories, and all blog post slugs
// Reads slugs from src/blogData.js (regex-based; no imports) and writes
// prerendered HTML files under build/<path>/index.html with exact canonical tags.

/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const HOST = process.env.HOST || 'https://trueallyguide.com';

function readFileSafe(p) {
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
}

function getBlogSlugs() {
  const src = readFileSafe(path.join('src', 'blogData.js'));
  if (!src) return [];
  const slugRe = /slug:\s*'([^'"\n]+)'/g;
  const slugs = new Set();
  let m;
  while ((m = slugRe.exec(src))) {
    const s = m[1].trim();
    if (s) slugs.add(`/blog/${s}`);
  }
  return Array.from(slugs);
}

function getPostMeta() {
  // Extract slug, title, description from blogData.js using simple regex passes
  const src = readFileSafe(path.join('src', 'blogData.js'));
  const blocks = src.split(/\{\s*slug:\s*'/).slice(1);
  const out = {};
  for (const block of blocks) {
    const slug = block.split("'")[0];
    const titleMatch = block.match(/\n\s*title:\s*'([^']+)'/);
    const descMatch = block.match(/\n\s*description:\s*'([^']+)'/);
    if (slug) {
      out[slug] = {
        title: titleMatch ? titleMatch[1] : slug,
        description: descMatch ? descMatch[1] : ''
      };
    }
  }
  return out;
}

function getCategoryPaths() {
  const src = readFileSafe(path.join('src', 'blogData.js'));
  const catMapMatch = src.match(/export const categorySlugMap = \{([\s\S]*?)\};/);
  const out = new Set();
  if (catMapMatch) {
    const body = catMapMatch[1];
    const valRe = /:\s*'([^']+)'/g;
    let m;
    while ((m = valRe.exec(body))) {
      const slug = m[1].trim();
      if (slug) out.add(`/category/${slug}`);
    }
  }
  return Array.from(out);
}

function writeCanonicalForPath(baseHtml, relPath) {
  const dom = new JSDOM(baseHtml);
  const d = dom.window.document;

  // Remove any existing canonical, then set exact canonical for this path
  d.querySelectorAll("link[rel='canonical']").forEach(n => n.remove());
  const can = d.createElement('link');
  can.setAttribute('rel', 'canonical');
  can.setAttribute('href', HOST + relPath);
  d.head.appendChild(can);

  // Title and description injection (server-side)
  const removeAll = (selector) => d.querySelectorAll(selector).forEach(n => n.remove());
  removeAll('title');
  removeAll('meta[name="description"]');

  const titleEl = d.createElement('title');
  titleEl.textContent = getTitleForPath(relPath);
  d.head.appendChild(titleEl);

  const descEl = d.createElement('meta');
  descEl.setAttribute('name', 'description');
  descEl.setAttribute('content', getDescriptionForPath(relPath));
  d.head.appendChild(descEl);

  // Ensure correct author meta
  d.querySelectorAll('meta[name="author"]').forEach(n => n.remove());
  const authorEl = d.createElement('meta');
  authorEl.setAttribute('name', 'author');
  authorEl.setAttribute('content', 'Marica Šinko');
  d.head.appendChild(authorEl);

  // Ensure main CSS loads unconditionally (safety for crawlers without JS)
  const cssLink = d.querySelector('link[rel="stylesheet"][href*="/static/css/"]');
  if (cssLink) {
    cssLink.removeAttribute('media');
    cssLink.removeAttribute('onload');
  }

  const outDir = path.join('build', relPath.replace(/^\//, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), '<!DOCTYPE html>\n' + d.documentElement.outerHTML);
}

function main() {
  const base = readFileSafe(path.join('build', 'index.html'));
  if (!base) {
    console.error('Base build/index.html not found; run the build first.');
    process.exit(1);
  }

  // Collect all target paths
  const targets = new Set(['/','/blog']);
  getCategoryPaths().forEach(p => targets.add(p));
  getBlogSlugs().forEach(p => targets.add(p));

  // Always include legal pages if present in app
  ['/privacy-policy','/terms'].forEach(p => targets.add(p));

  console.log(`Applying canonicals for ${targets.size} paths...`);
  for (const rel of targets) {
    try {
      writeCanonicalForPath(base, rel);
      console.log(`  ✓ ${rel} → ${HOST + rel}`);
    } catch (e) {
      console.warn(`  ! Failed for ${rel}: ${e.message}`);
    }
  }
}

// Helpers to compute titles and descriptions
const postMeta = getPostMeta();
const shortTitles = {
  'how-to-know-if-you-deserve-better-relationship-introvert-woman-guide': 'Do You Deserve Better? 7 Clear Signs for Introvert Women',
  'how-to-stop-attracting-narcissists-9-proven-strategies': 'How to Stop Attracting Narcissists: 9 Proven Strategies',
  'how-to-be-confident-as-an-introvert-woman-guide': 'How to Be Confident as an Introvert Woman',
  'how-to-speak-up-in-meetings-introvert-strategies-2025': 'How to Speak Up in Meetings as an Introvert',
  'introvert-social-battery-drained-recovery-methods': 'Introvert Social Battery Drained? 9 Ways to Recharge',
  'morning-routine-for-confidence-and-productivity-2025': 'Morning Routine for Confidence and Productivity',
  'post-breakup-glow-up-transformation-guide-10-proven-steps-to-become-your-best-self-in-2025': 'Post-Breakup Glow Up: 10 Steps'
};

function cap160(s) {
  if (!s) return '';
  if (s.length <= 160) return s;
  const cut = s.slice(0, 161);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut).trim();
}

const categoryNames = {
  'introversion-and-personality': 'Introversion & Personality',
  'relationships-and-dating': 'Relationships & Dating',
  'career-and-workplace': 'Career & Workplace',
  'self-development': 'Self-Development',
  'womens-wellness': "Women's Wellness"
};

function getTitleForPath(relPath) {
  if (relPath === '/') return 'Quiet Strength — Self‑Help & Productivity for Introverted Women';
  if (relPath === '/blog') return 'Blog | Quiet Strength';
  if (relPath.startsWith('/category/')) {
    const slug = relPath.replace('/category/','');
    const name = categoryNames[slug] || 'Articles';
    return `${name} Articles | Quiet Strength`;
  }
  if (relPath.startsWith('/blog/')) {
    const slug = relPath.replace('/blog/','');
    const meta = postMeta[slug] || {};
    return (shortTitles[slug] || meta.title || slug) + ' | Quiet Strength';
  }
  if (relPath === '/privacy-policy') return 'Privacy Policy | Quiet Strength';
  if (relPath === '/terms') return 'Terms of Use | Quiet Strength';
  return 'Quiet Strength';
}

function getDescriptionForPath(relPath) {
  if (relPath === '/') return 'Self-help and productivity for introverted women—confidence, boundaries, energy, career growth, and intentional living.';
  if (relPath === '/blog') return 'Latest articles from Quiet Strength—practical guidance for introverted women on confidence, focus, and sustainable success.';
  if (relPath.startsWith('/category/')) {
    const slug = relPath.replace('/category/','');
    const map = {
      'relationships-and-dating': 'Explore articles on relationships and dating with confidence—boundaries, healthy communication, and intentional choices for introverted women.',
      'career-and-workplace': 'Advance your career without burnout. Practical advice for introverted women on boundaries, focus, and sustainable success.',
      'introversion-and-personality': 'Insights on introversion and personality types with practical ways to leverage your strengths as an introverted woman.',
      'self-development': 'Grow with purpose: confidence, mindset, habits, and systems designed for introverted women.'
    };
    return cap160(map[slug] || 'Articles for introverted women to thrive—confidence, energy, and intentional growth.');
  }
  if (relPath.startsWith('/blog/')) {
    const slug = relPath.replace('/blog/','');
    const meta = postMeta[slug] || {};
    return cap160(meta.description || 'Article from Quiet Strength for introverted women.');
  }
  if (relPath === '/privacy-policy') return 'Learn how Quiet Strength collects, uses, and protects your personal information.';
  if (relPath === '/terms') return 'Terms governing the use of Quiet Strength.';
  return '';
}

main();
