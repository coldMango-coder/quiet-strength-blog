CODEX FIX — Title must be “Marica Šinko” (no �) + Avatar centering (NO SEO/CWV REGRESSIONS)
Do not regress

Core Web Vitals must hold or improve: LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT/INP ≤ 50 ms.

SEO must remain identical: one canonical per page, OG/Twitter & JSON-LD intact, no duplicate Article.

No new render-blocking CSS/JS. Any new JS runs idle and is tiny. WCAG 2.1 AA must remain.

At the end, run:

npm run mini
npm run fast
node scripts/verify-title-and-author.mjs

1) Make server-rendered title EXACTLY “About Marica Šinko …”

The mojibake persists because the source string feeding <title> is corrupted or the file is non-UTF-8. Fix at the source (not client override).

1.1 Ensure charset is authoritative

public/index.html → first meta MUST be:

<meta charset="utf-8" />


src/components/Seo.js (or your Helmet/SEO file) → first Helmet child:

<meta charSet="utf-8" />

1.2 Replace corrupted literals in source (code & MD/MDX)

Search and replace (all of these → exact Marica Šinko):

Marica �inko
Marica ?inko
Marica \uFFFDinko
Marica \?inko


Places to check (fix every hit):

src/pages/About*.(js|jsx|tsx) and any about component

src/blogData.js and post components

src/components/AuthorBio*.{js,jsx,tsx}

Any MD/MDX/front-matter with author/title strings

Save files as UTF-8 (no BOM).

1.3 Set About page title explicitly with proper diacritic

In your About page component (e.g., src/pages/About.jsx), make sure the SEO component receives the correct Unicode title:

import Seo from '@/components/Seo';
const ABOUT_TITLE = 'About Marica Šinko | Quiet Strength';

export default function AboutPage() {
  return (
    <>
      <Seo title={ABOUT_TITLE} description="..." path="/about" />
      {/* rest of the page */}
    </>
  );
}


Do not ASCII-fold or “deburr” this title. The canonical/og:url logic stays as is.

2) Author avatar (About + Post footers) — show whole face, no weird placement, no CLS

Create a single reusable avatar and use it in both contexts. Remove any negative margins or transforms that push the circle off the container.

2.1 Component

src/components/Avatar.jsx (create or update):

// Avatar.jsx — centered face, slight upward bias; intrinsic size prevents CLS
import React from 'react';

export default function Avatar({
  src,
  alt = 'Author avatar',
  size = 128,             // px, intrinsic to block CLS
  focal = '50% 32%',      // bump face slightly upward; tweak if needed
  containOnUltraNarrow = true,
}) {
  const s = Number(size) || 128;
  return (
    <div
      className="rounded-full overflow-hidden border-4 border-white shadow"
      style={{ width: s, height: s }}
    >
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


Add to global CSS (tiny, safe, optional for very narrow phones):

@media (max-width: 360px) {
  .rounded-full > img { object-fit: contain; background: #fff; }
}

2.2 Use it with stable layout (no clipping)

About page hero/intro section: replace any raw <img> with:

import Avatar from '@/components/Avatar';

<div className="grid grid-cols-[auto_1fr] items-center gap-4">
  <Avatar src="/images/author.jpg" size={144} />
  <div> {/* intro text */} </div>
</div>


Article footers (Author card):

<div className="grid grid-cols-[auto_1fr] items-center gap-4">
  <Avatar src="/images/author.jpg" size={96} />
  <div> {/* bio text */} </div>
</div>


Important: Remove negative margins/absolute positioning/transforms around the avatar that might push part of the circle out of view. Keep the grid/flex wrapper as above.

3) Verification script (prove it’s fixed in the build)

Create scripts/verify-title-and-author.mjs:

import fs from 'node:fs';
import path from 'node:path';

// Pages to check – adjust if your about route differs.
const PAGES = [
  'build/about/index.html',
  'build/index.html',
];

const MUST_CONTAIN = [
  /<title>.*Marica\s+Šinko.*<\/title>/i,            // tab title correctly shows Š
];

const BAD_PATTERNS = [
  /Marica\s+[�\?]/i,   // mojibake replacement
  /Marica\s+[€¢]/i,    // stray currency chars
];

let failed = false;

for (const p of PAGES) {
  if (!fs.existsSync(p)) { console.warn('WARN missing', p); continue; }
  const html = fs.readFileSync(p, 'utf8');

  for (const rx of MUST_CONTAIN) {
    if (!rx.test(html)) {
      console.error(`FAIL: ${p} does not contain expected diacritic string (Š) in <title>.`);
      failed = true;
    }
  }

  for (const bad of BAD_PATTERNS) {
    if (bad.test(html)) {
      console.error(`FAIL: ${p} still contains mojibake or bad chars near author name.`);
      failed = true;
    }
  }
}

if (failed) process.exit(1);
console.log('verify-title-and-author: OK — correct Š in <title>, no mojibake found.');

4) Run & accept
npm install
npm run mini
npm run fast
node scripts/verify-title-and-author.mjs


Accept when all true:

Browser tab for About shows “About Marica Šinko …” (not “�inko”).

About page and each post footer: avatar shows the whole face, neatly centered, no weird cutoffs, no layout shift.

All SEO/CWV validations still pass.