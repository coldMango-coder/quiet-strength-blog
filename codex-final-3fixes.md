CODEX — FINAL 3 FIXES (NO SEO/CWV REGRESSIONS)

Non-negotiables (must hold or improve): LCP ≤ 1.8s mobile, CLS ≤ 0.05, TBT/INP ≤ 50ms.
Do not change canonical/OG/Twitter/JSON-LD logic or counts. Exactly one Article schema per post.
No render-blocking CSS/JS; WCAG 2.1 AA stays compliant.

After edits, run:

npm run mini
npm run fast

A) Category card titles (Home → “Our Core Self-Help Themes…”)

Goal: Titles show on one line on desktop (no choppy wrapping), with graceful truncation if space is still tight. Mobile remains readable.

A1. Update the Category Card title element

Find the component that renders the category tiles (e.g., src/components/CategoryCards*.jsx or the Home section).
Change the title <h3> classes exactly:

<h3
  className="
    text-lg md:text-xl font-semibold tracking-tight leading-tight
    whitespace-normal md:whitespace-nowrap
    overflow-hidden text-ellipsis
  "
  title={title}   // shows full title on hover if truncated
>
  {title}
</h3>

A2. Give the card enough width at desktop

On the card wrapper, add min widths so titles have room:

<div className="
  rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200
  sm:min-w-[280px] lg:min-w-[360px]
">
  {/* ... */}
</div>

A3. Keep the grid spacious

For the grid container, ensure:

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">


Acceptance: On desktop, each title is on one line (not split word-by-word). If a screen is extremely narrow, it may truncate with an ellipsis, and the full title appears in the tooltip.

B) “By Marica Šinko” still inconsistent in some article meta (e.g., shows “Marica Å inko”)

Goal: The author name renders exactly “Marica Šinko” everywhere—UI and server-rendered meta/Helmet.

B1. Strengthen the display normalizer to fix common mojibake

Create/replace src/lib/content/normalizeDisplayText.js:

// Keeps diacritics like Š, normalizes Unicode, removes stray currency symbols,
// fixes common mojibake (UTF-8 Š -> Latin-1 "Å ").
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  let s = input.normalize('NFC')
    .replace(/\u00A0/g, ' ')
    .replace(/[€¢]/g, '');

  // Hard fixes for misdecoded "Š" patterns (common on Windows-1252/Latin-1):
  // "Marica Å inko" or "Marica Å inko" → "Marica Šinko"
  s = s.replace(/Marica\s+Å(?:\s|&nbsp;|\\u00A0)?inko/gi, 'Marica Šinko');

  // Generic U+0160 (Š) misread as "Å "
  s = s.replace(/Å\s/gu, 'Š');

  return s;
}

B2. Apply normalizer in all UI meta rows and in SEO component

Wherever the “By …” line is shown (Post header/meta/footer): use

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';
const uiAuthor = normalizeDisplayText(post?.author?.name ?? authorName ?? 'Marica Šinko');


and render By {uiAuthor}.

In src/components/Seo.js (or your Helmet SEO file), ensure we normalize human-readable fields used in <title>, og:title, twitter:title, and any author meta text. (Do not change canonical or url generation.)

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';

const displayTitle  = normalizeDisplayText(title);
const displayAuthor = normalizeDisplayText(article?.authorName ?? 'Marica Šinko');

<Helmet>
  <meta charSet="utf-8" />
  <title>{displayTitle}</title>
  <meta name="author" content={displayAuthor} />
  <meta property="og:title" content={displayTitle} />
  <meta name="twitter:title" content={displayTitle} />
  {/* keep og:url, canonical etc. as is */}
</Helmet>

B3. Fix literals at the source

Run a repo-wide replace of broken forms to the exact string Marica Šinko in:

src/blogData.js

Any article/page component headers/footers

Any MD/MDX/front-matter

Bad forms to kill:

Marica Å inko

Marica Å inko

Marica �inko

Marica \uFFFDinko

Marica ?inko

Acceptance: Every article page shows “By Marica Šinko” in the visible meta row and no mojibake appears in the tab title/Helmet meta on built HTML.

C) “Read the Blog” CTA and navbar “Blog” don’t navigate

Goal: The CTA and nav both route to the blog listing page (e.g., /blog). No hash anchors unless that’s your design; and work with NormalizedLink.

C1. Fix the CTA

In the Home hero section component, change the CTA to:

import NormalizedLink from '@/components/NormalizedLink';

// replace any <a href="#blog"> or "/#blog"
<NormalizedLink href="/blog" className="btn btn-secondary">
  Read the Blog
</NormalizedLink>

C2. Fix the navbar item

In the header/nav component, ensure the “Blog” item is:

<NormalizedLink href="/blog" className="nav-link">
  Blog
</NormalizedLink>


If you intentionally want to scroll to a home section, then keep href="/#blog" and add id="blog" to that section in the Home page. Otherwise route to /blog.

Acceptance: Clicking “Read the Blog” or navbar “Blog” lands on the /blog listing (or the intended section if you chose the anchored variant).

D) Safety checks (must pass)

Build & tests

npm run mini
npm run fast


Manual spot checks

Home → Category titles: one line (or smart truncation), no choppy breaks.

Open an affected article: meta row reads By Marica Šinko; tab title has Š, not Å/�.

CTAs “Read the Blog” and navbar “Blog” route correctly.

No CWV/SEO regressions:

No new blocking files; avatar/cards retain explicit width/height or stable min-widths; CLS doesn’t move.

Exactly one canonical per page; JSON-LD counts unchanged.