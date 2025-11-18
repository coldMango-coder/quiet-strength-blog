🔧 HOTFIX (LOCKED): Stop home cards overlapping + force “Marica Šinko” everywhere

Do NOT regress Core Web Vitals or SEO.

Keep/improve: LCP ≤1.8s (mobile), CLS ≤0.05, TBT/INP ≤50ms.

Do not change canonical/OG/Twitter/JSON-LD counts (one Article schema per post).

No render-blocking CSS/JS additions.

After edits run:

npm run mini
npm run fast
node scripts/verify-overlap-author.mjs

A) HOME — “Our Core Self-Help Themes for Introverted Women”
A1) Replace the grid wrapper (safe grid; no arbitrary utilities)

Find the component that renders that section (Home / Themes). Replace the cards wrapper with:

<div
  id="home-categories-grid"
  className="
    grid w-full
    grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
    gap-6 lg:gap-8
    auto-rows-fr
    relative isolate overflow-visible
  "
>
  {/* cards */}
</div>


isolate starts a new stacking context so children can’t bleed onto neighbors.

A2) Global, section-scoped CSS override (kills transforms/neg-margins that cause overlap)

Add (or append) to src/styles/global.css (or your main Tailwind css import).
If you don’t have that file, create it and ensure it’s imported once (e.g., in src/index.js or App.js).

/* ===== HOME THEMES – OVERLAP KILL SWITCH (scoped) ===== */
#home-categories-grid .category-card,
#home-categories-grid .category-card * {
  transform: none !important;
}

#home-categories-grid .category-card {
  position: relative !important;
  margin: 0 !important;
  overflow: hidden;
  z-index: 0;
  contain: layout paint size;
  /* Avoid hover lifts that escape grid cells */
  transition: box-shadow .2s ease;
}

#home-categories-grid .category-card:hover {
  box-shadow: 0 6px 20px rgba(0,0,0,.08);
}

/* Images must never escape the card */
#home-categories-grid .category-card img {
  display: block;
  width: 100%;
  aspect-ratio: 16 / 10;
  height: auto;
  object-fit: cover;
  object-position: center;
}


This hard-resets any previously defined hover:-translate-y, scale-*, negative margins, or transforms that were causing cards to cover each other.

A3) Card markup (stable, transform-free)

Ensure each card root has class category-card and no inline transform/negative margin:

<div className="category-card flex h-full flex-col justify-between rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
  {/* icon */}
  <h3 className="text-lg md:text-xl font-semibold tracking-tight leading-tight text-center whitespace-normal md:whitespace-nowrap overflow-hidden text-ellipsis break-normal hyphens-none">
    {title}
  </h3>
  <p className="mt-3 text-center text-sm leading-6">{description}</p>
  {/* link */}
</div>

B) Author must render exactly “Marica Šinko” (UI + meta + build output)

You still have “Marica Å inko/�inko” on some pages. We’ll fix at 3 layers and add a runtime safety net (non-blocking, idle).

B1) Strong normalizer (keeps diacritics)

Create/replace src/lib/content/normalizeDisplayText.js:

export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;

  let s = input
    .normalize('NFC')         // compose diacritics
    .replace(/\u00A0/g, ' ')  // nbsp -> space
    .replace(/[€¢]/g, '');    // stray currency symbols

  // Mojibake fixes for Š
  s = s.replace(/Marica\s*A[\u030A\s]*inko/gi, 'Marica Šinko'); // "Marica Å inko", "Marica Å inko"
  s = s.replace(/Å\s*(?=inko)/g, 'Š');                          // "Å inko" -> "Šinko"
  s = s.replace(/�(?=inko)/g, 'Š');                             // "�inko" -> "Šinko"

  return s.replace(/\s{2,}/g, ' ').trim();
}

B2) Use normalizer in UI & Helmet everywhere

Wherever author/title render (post header, author card, Seo.js), wrap values:

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';

const rawAuthor = post?.author?.name ?? authorName ?? 'Marica Šinko';
const author    = normalizeDisplayText(rawAuthor);

const displayTitle = normalizeDisplayText(title);

<span>By {author}</span>

<Helmet>
  <meta charSet="utf-8" />
  <title>{displayTitle}</title>
  <meta name="author" content={author} />
  <meta property="og:title" content={displayTitle} />
  <meta name="twitter:title" content={displayTitle} />
</Helmet>


Also ensure the first meta in public/index.html is:

<meta charset="utf-8" />

B3) Post-build fixer (guarantee prerendered HTML is correct)

Create scripts/postbuild-fix-author.mjs:

import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'build';
const FIXES = [
  { rx: /Marica\s+Å\s*inko/gi, to: 'Marica Šinko' },
  { rx: /Marica\s+�inko/gi,    to: 'Marica Šinko' },
  { rx: /Marica\s+\?inko/gi,   to: 'Marica Šinko' }
];

function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);return e.isDirectory()?walk(p):p;});}

if (fs.existsSync(ROOT)) {
  for (const f of walk(ROOT)) {
    if (!/\.(html|json)$/i.test(f)) continue;
    let s = fs.readFileSync(f, 'utf8'), o = s;
    for (const {rx,to} of FIXES) s = s.replace(rx, to);
    if (s !== o) fs.writeFileSync(f, s, 'utf8');
  }
  console.log('postbuild-fix-author: done');
}


Update package.json (append, don’t remove existing scripts):

{
  "scripts": {
    "postbuild:fix": "node scripts/postbuild-fix-author.mjs",
    "mini": "npm run build && npm run postbuild:fix && node scripts/quick-validate-seo.mjs",
    "fast": "npm run build && npm run postbuild:fix && npm run test -- --watchAll=false && npm run fast:playwright && npm run fast:seo"
  }
}

B4) Ultra-light runtime guard (runs on idle; no CWV impact)

Create src/lib/runtime/fixAuthorMojibake.js:

export function fixAuthorMojibakeRuntime() {
  const apply = () => {
    const targets = [
      ...document.querySelectorAll('meta[name="author"]'),
      ...document.querySelectorAll('meta[property="article:author"]'),
    ];
    targets.forEach(m => {
      if (!m.content) return;
      m.content = m.content
        .replace(/Marica\s+Å\s*inko/gi, 'Marica Šinko')
        .replace(/Marica\s+�inko/gi, 'Marica Šinko')
        .replace(/Marica\s+\?inko/gi, 'Marica Šinko');
    });

    // visible text nodes (author lines)
    document.querySelectorAll('body').forEach(root => {
      root.innerHTML = root.innerHTML
        .replace(/Marica\s+Å\s*inko/gi, 'Marica Šinko')
        .replace(/Marica\s+�inko/gi, 'Marica Šinko')
        .replace(/Marica\s+\?inko/gi, 'Marica Šinko');
    });

    // fix browser tab if needed
    if (document.title) {
      document.title = document.title
        .replace(/Marica\s+Å\s*inko/gi, 'Marica Šinko')
        .replace(/Marica\s+�inko/gi, 'Marica Šinko')
        .replace(/Marica\s+\?inko/gi, 'Marica Šinko');
    }
  };

  if ('requestIdleCallback' in window) requestIdleCallback(apply, { timeout: 800 });
  else setTimeout(apply, 0);
}


Call it once in App.js (or root layout) after mount:

import { useEffect } from 'react';
import { fixAuthorMojibakeRuntime } from '@/lib/runtime/fixAuthorMojibake';

useEffect(() => {
  fixAuthorMojibakeRuntime();
}, []);


This is a last-resort safety that runs after paint (idle), so it doesn’t affect LCP/TBT and guarantees visible/meta text shows Šinko even if a stray source slipped through.

C) Verification script

Create scripts/verify-overlap-author.mjs:

import fs from 'node:fs';
import path from 'node:path';

const roots = ['build'];
const BAD = [/Marica\s+Å\s*inko/i, /Marica\s+�inko/i, /Marica\s+\?inko/i];

function walk(d){return fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>{const p=path.join(d,e.name);return e.isDirectory()?walk(p):p;});}

let bad = [];
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root)) {
    if (!/\.(html|json)$/i.test(f)) continue;
    const s = fs.readFileSync(f, 'utf8');
    BAD.forEach(rx => { if (rx.test(s)) bad.push(`${f} :: ${rx}`); });
  }
}

if (bad.length) {
  console.error('❌ Mojibake still present:\n' + bad.join('\n'));
  process.exit(1);
} else {
  console.log('✅ All built files show “Marica Šinko”.');
}

D) Run & accept only when:
npm run mini
npm run fast
node scripts/verify-overlap-author.mjs


Home “Themes” cards do not overlap on hover or scroll (they stay in their own cells).

Those titles are readable (desktop ≈ single line with ellipsis; mobile wraps sanely).

All pages show “Marica Šinko” in UI, tab title, and meta; no Å/� anywhere.

Tests/validators pass; no CWV/SEO regressions.