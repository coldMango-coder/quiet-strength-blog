CODEX — HARD FIX (Do not degrade SEO or Core Web Vitals)

Do NOT reduce Core Web Vitals. Keep or improve: LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT/INP ≤ 50ms.
Do NOT alter canonical/OG/Twitter/JSON-LD counts or logic. No duplicate Article schemas.
No render-blocking CSS/JS. New JS runs on idle and must not create long tasks.

At the end, run:

npm run mini
npm run fast
node scripts/scan-mojibake.mjs

0) Create a branch (safety)
git checkout -b fix/hard-marica-avatar-cats

1) MUST render exactly By Marica Šinko (no mojibake)
1.1 Document & Helmet charset (authoritative)

public/index.html → ensure the first <meta> is exactly:

<meta charset="utf-8" />


Move it to be first if needed. Do not duplicate.

src/components/Seo.js (or the helmet component you actually use) → ensure first Helmet child is:

<meta charSet="utf-8" />

1.2 Add a tiny UI normalizer (keeps Š, drops junk)

Create: src/lib/content/normalizeDisplayText.js

// Keeps diacritics (Š). Normalizes NFC. Removes NBSP and stray currency symbols that leaked.
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  return input
    .normalize('NFC')
    .replace(/\u00A0/g, ' ')
    .replace(/[€¢]/g, '');
}

1.3 Enforce the exact display string in every “By …” line

Search & patch all UI places that show the author (PowerShell or bash lines below). In each, apply this pattern:

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';

// DO NOT slugify. This is DISPLAY ONLY.
const displayAuthorRaw = post?.author?.name ?? authorName ?? 'Marica Šinko';
const displayAuthor = normalizeDisplayText(displayAuthorRaw);

<p className="text-brand-primary text-base">
  By {displayAuthor}
  <span className="mx-2">•</span>
  <time dateTime={post.date}>{formattedDate}</time>
  <span className="mx-2">•</span>
  {post.readTime}
</p>


Files to patch (search and update every hit):

"By "
"By&nbsp;"
authorName
post.author
AuthorBio
AuthorCard
AuthorBadge
PostMeta
PostHeader
ArticleMeta

1.4 Fix any corrupted literals in source data

Replace all of these anywhere in the repo with the exact string Marica Šinko:

Marica �inko

Marica ?inko

Marica \uFFFDinko

Marica \?inko

Typical places: src/blogData.js, any MD/MDX front-matter, old AuthorBio.js.

1.5 Replace any non-UTF-8 file with UTF-8

If src/components/AuthorBio.js (or others) is non-UTF-8, create a clean UTF-8 file and point imports to it:

Create: src/components/AuthorBio.jsx — copy JSX from the old file, fix any broken chars, save as UTF-8 (no BOM).

Create: src/components/AuthorBio/index.js

export { default } from './AuthorBio.jsx';


Imports can continue to use ../components/AuthorBio (the index re-export keeps paths stable).

2) Author avatar (homepage + article footer): full face, centered, zero CLS
2.1 Reusable Avatar component

Create/replace: src/components/Avatar.jsx

// Avatar.jsx — centered face w/ slight upward bias; intrinsic size prevents CLS
import React from 'react';

export default function Avatar({ src, alt = 'Author avatar', size = 128, focal = '50% 30%' }) {
  const s = Number(size) || 128;
  return (
    <div className="rounded-full overflow-hidden border-4 border-white shadow"
         style={{ width: s, height: s }}>
      <img
        src={src}
        alt={alt}
        width={s}
        height={s}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ objectPosition: focal }}
      />
    </div>
  );
}


Optional ultra-narrow safety (add to your global CSS; tiny & non-blocking):

@media (max-width: 360px) {
  .rounded-full > img { object-fit: contain; background:#fff; }
}

2.2 Use Avatar in both places

Homepage hero author:
Replace raw <img> with <Avatar src="/images/author.jpg" size={144} />

Article footer author card:
Replace raw <img> with <Avatar src="/images/author.jpg" size={96} />

Parent layout suggestion (prevents weird squeeze):

<div className="grid grid-cols-[auto_1fr] items-center gap-4">
  <Avatar ... />
  <div> ... text ... </div>
</div>

3) Category titles: stop fragmenting into many tiny lines
3.1 Container and card sizes

Use sensible min-width so titles aren’t squeezed:

Container

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* cards */}
</div>


Card wrapper

<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:min-w-[280px] lg:min-w-[320px]">
  <h3 className="cat-title text-lg md:text-xl font-semibold tracking-tight leading-tight whitespace-normal break-normal hyphens-none">
    Introversion & Personality
  </h3>
  <p className="text-sm md:text-base leading-6"> ... </p>
</div>


Balanced titles (global CSS; tiny rule, non-blocking):

.cat-title { text-wrap: balance; }

4) Verification scripts (make Codex prove it)
4.1 Quick scanner for mojibake in source and build

Create: scripts/scan-mojibake.mjs

import fs from 'node:fs';
import path from 'node:path';

const BAD = [/�/, /Marica\s?[?\\uFFFD]/i, /Marica\s?[€¢]/i];
const GOOD = /By\s+Marica\s+Šinko/;

function walk(dir) {
  const out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith('.')) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

let badHits = [];
let goodUi = false;

const roots = ['src', 'build'];
for (const root of roots) {
  if (!fs.existsSync(root)) continue;
  for (const f of walk(root)) {
    const ext = path.extname(f).toLowerCase();
    if (!['.js','.jsx','.ts','.tsx','.html','.md','.mdx','.json'].includes(ext)) continue;
    const s = fs.readFileSync(f, 'utf8');
    if (GOOD.test(s)) goodUi = true;
    BAD.forEach(rx => { if (rx.test(s)) badHits.push({ file:f, rx:String(rx) }) });
  }
}

if (badHits.length) {
  console.error('Found mojibake or corrupted variants:');
  for (const h of badHits) console.error(` - ${h.file} matched ${h.rx}`);
  process.exit(1);
}
if (!goodUi) {
  console.warn('WARN: Could not find literal "By Marica Šinko" in built or source files. Verify via UI.');
}
console.log('Mojibake scan: OK (no bad patterns found)');

4.2 Search/replace helper (Codex can run these to be sure)

(Do not run if already clean; for reference only)

Bash

rg -n "Marica �inko|Marica \\uFFFDinko|Marica \\?inko|Marica ?inko" src || true


PowerShell

rg -n "Marica �inko|Marica \\uFFFDinko|Marica \\?inko|Marica ?inko" src

5) Core Web Vitals & SEO safety (do not change)

CLS: Avatar <img> has explicit width+height; categories don’t introduce layout shifts.

LCP: Do not add blocking CSS/JS; avatar change is CSS-only; sanitizer is light.

TBT/INP: No long tasks; new code does O(n) string normalization at render only.

SEO: Do not alter canonical generation, JSON-LD counts, or OG/Twitter URL values.

6) Run & confirm
npm install
npm run mini
npm run fast
node scripts/scan-mojibake.mjs


Acceptance (must be true):

Every “By …” line shows exactly By Marica Šinko.

No �/?/€/¢ anywhere in author names in UI or built HTML.

Homepage + article footers: author avatar shows full face, centered, no layout shift.

Category titles appear on few, balanced lines (not split to fragments).

No SEO regressions; no CWV regressions.

7) Commit
git add .
git commit -m "hardfix: exact 'By Marica Šinko', avatar centering (no CLS), balanced category titles — no SEO/CWV regressions"

Notes for the agent

Display strings keep diacritics. Never pass display strings through slugify/deburr. Slugs/URLs remain ASCII as before.

If mojibake persists after this, re-save the specific offending file as UTF-8 (without BOM) and rerun the verification script.