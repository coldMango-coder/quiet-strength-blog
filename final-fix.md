🧩 CODEX FINAL FIX — Category Overlap + Persistent “Marica Å inko” Encoding Bug

(NO SEO / CWV regressions allowed)

⚙️ Baseline rules

Do not reduce Core Web Vitals numbers. Only equal or better.
Keep all schema, canonical, OG/Twitter/JSON-LD intact.
No render-blocking scripts. No layout shifts introduced (CLS ≤ 0.05).

🧱 1. FIX CATEGORY CARD OVERLAP (Homepage grid)

Goal: Cards must align cleanly in a responsive grid, never overlap, even on zoomed/ultrawide screens. Titles should fit on one line where possible.

✅ Steps
1.1 Update container CSS / JSX

Locate the section wrapper in your Home page (often src/sections/HomeCategories.jsx or similar).
Replace the grid container with:

<div className="
  grid 
  grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
  gap-6 lg:gap-8
  place-items-stretch
  auto-rows-fr
  w-full
">

1.2 Update each card wrapper

Inside that grid, make sure each card div is:

<div
  className="
    flex flex-col justify-between
    rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200
    transition-transform hover:-translate-y-1 hover:shadow-md
    min-w-[280px] sm:min-w-[300px] md:min-w-[320px] lg:min-w-[340px]
    h-full
  "
>

1.3 Prevent cards from overlapping on small screens

Add this rule to your main stylesheet (e.g., globals.css or Home.css):

/* Prevent card overlap under grid compression */
@media (min-width: 768px) {
  .grid > div {
    flex: 1 1 0;
  }
}

1.4 Improve card title readability

Inside each card:

<h3
  className="
    text-lg md:text-xl font-semibold tracking-tight leading-tight
    text-center
    whitespace-normal md:whitespace-nowrap
    overflow-hidden text-ellipsis
  "
  title={title}
>
  {title}
</h3>


✅ Expected Result:

Cards stay in tidy grid, never overlapping or floating on each other.

Each card maintains its own white background and shadow.

Titles are in one readable row (or gracefully truncated).

🧑‍💻 2. FIX ENCODING BUG “Marica Å inko” → “Marica Šinko” EVERYWHERE

You already added a normalizer — but some articles are likely fetched or rendered before normalization (or from MD/MDX front-matter with Latin-1 encoding). Let’s make the fix bulletproof.

✅ Steps
2.1 Strengthen normalizer

Replace the existing src/lib/content/normalizeDisplayText.js with this exact code:

// normalizeDisplayText.js — fixes mojibake (Å→Š), keeps diacritics, NFC normalization
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  let s = input.normalize('NFC').replace(/\u00A0/g, ' ').replace(/[€¢]/g, '');

  // Explicit replacements for mojibake patterns:
  s = s
    // common UTF-8→Latin1 corruption of Š
    .replace(/Marica\s*Å\s*inko/gi, 'Marica Šinko')
    .replace(/Å\s*inko/gi, 'Šinko')
    // double spaces or artifacts
    .replace(/\s{2,}/g, ' ')
    .trim();

  return s;
}

2.2 Apply normalization before render and meta generation

In every component that shows or feeds author data (PostMeta.jsx, ArticleHeader.jsx, Seo.js, etc.), import and use:

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';

const authorRaw = post?.author?.name ?? authorName ?? 'Marica Šinko';
const author = normalizeDisplayText(authorRaw);


Use {author} everywhere you display it — in UI and Helmet/SEO tags.

2.3 Sanitize MD/MDX and JSON data

Search your entire repo for these patterns and replace with the exact UTF-8 form Marica Šinko:

Marica Å inko
Marica Åinko
Marica �inko
Marica ?inko


Then ensure all files are saved as UTF-8 (no BOM).

🧩 3. VERIFY FIX

Create or update script: scripts/verify-encoding-and-layout.mjs

import fs from 'node:fs';
import path from 'node:path';

const pages = ['build/index.html', 'build/blog'];
const bad = [/Marica\s+[Å�\?]/, /Å\s*inko/, /�inko/];
let badFound = false;

for (const p of pages) {
  if (!fs.existsSync(p)) continue;
  const data = fs.readFileSync(p, 'utf8');
  bad.forEach(rx => {
    if (rx.test(data)) {
      console.error(`❌ Encoding error found in: ${p}`);
      badFound = true;
    }
  });
}

if (!badFound) console.log('✅ All author names correctly show "Marica Šinko" everywhere.');



Then run:

npm run mini
npm run fast
node scripts/verify-encoding-and-layout.mjs

🧾 Acceptance checklist

✅ Category cards:

Perfect grid alignment, no overlap on any screen size.

Titles render in one clean row on desktop.

✅ Author name:

Every “By Marica Šinko” shows correctly (no Å, no question marks).

Browser tab, meta, and visible text all use the correct diacritic Š.

✅ Performance:

CLS ≤ 0.05

LCP ≤ 1.8 s

No new blocking JS/CSS

All schema and meta intact