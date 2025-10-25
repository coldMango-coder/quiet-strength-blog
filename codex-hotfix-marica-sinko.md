A) MUST show “By Marica Šinko” (never “�inko”, never “?inko”)
A1. Make UTF-8 authoritative at document & Helmet

public/index.html → ensure the first meta is exactly:

<meta charset="utf-8" />


(If it is not the first meta, move it there. Do not duplicate.)

src/components/Seo.js (your Helmet component) → first Helmet child:

<meta charSet="utf-8" />

A2. Create a display-only normalizer (keeps Š, removes only garbage)

Add src/lib/content/normalizeDisplayText.js

// NFC normalize; keep diacritics (Š); remove NBSP and stray '€'/'¢'.
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  return input
    .normalize('NFC')
    .replace(/\u00A0/g, ' ')
    .replace(/[€¢]/g, '');
}

A3. Force author display to the exact string and sanitize only for UI

In every component that renders the “By …” line or author name in UI
(search & patch: PostMeta, PostHeader, ArticleMeta, AuthorCard, AuthorBio, any “By ” occurrences):

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';

// Force the exact display string; DO NOT slugify or ASCII-fold here
const displayAuthorRaw =
  (post?.author?.name ?? authorName ?? 'Marica Šinko');

const displayAuthor = normalizeDisplayText(displayAuthorRaw);

<p className="text-brand-primary text-base">
  By {displayAuthor}
  <span className="mx-2">•</span>
  <time dateTime={post.date}>{formattedDate}</time>
  <span className="mx-2">•</span>
  {post.readTime}
</p>


Important: This is display-only. Do not pass this through slugify or use it for URLs/canonicals.

A4. Replace any corrupted source strings

Search & replace across content sources (code & MD/MDX):

Replace all of:

Marica �inko

Marica ?inko

Marica \uFFFDinko

with exactly: Marica Šinko

Files to check: src/blogData.js, any post/page components, any Markdown/MDX front-matter, and the old AuthorBio.js.

A5. Kill legacy non-UTF-8 file & replace with UTF-8

If src/components/AuthorBio.js exists (non-UTF-8 per previous agent note), delete it and create src/components/AuthorBio.jsx (UTF-8 saved) with the same JSX content (fix any broken chars).

Add src/components/AuthorBio/index.js:

export { default } from './AuthorBio.jsx';


Update imports only if needed (re-exports keep paths stable).

A6. Helmet titles/descriptions should use display strings (diacritics kept)

In Seo.js, when setting OG/Twitter titles:

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';
const displayTitle = normalizeDisplayText(title);
const displayAuthor = normalizeDisplayText(article?.authorName ?? 'Marica Šinko');
// Use displayTitle/displayAuthor in OG/Twitter content (NOT for URLs).


Acceptance (hard requirement):

Page/tab titles and every “By …” line render exactly By Marica Šinko.

Nowhere in UI shows �, ?, €, or ¢ in that name.

B) Author avatar (homepage + article footer) — show full face, centered, zero CLS
B1. Reusable Avatar component

Add/Update src/components/Avatar.jsx

// Centered face with slight upward bias; intrinsic size prevents CLS
export default function Avatar({ src, alt = 'Author avatar', size = 128, focal = '50% 30%' }) {
  return (
    <div className="rounded-full overflow-hidden border-4 border-white shadow"
         style={{ width: size, height: size }}>
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className="w-full h-full object-cover"
        style={{ objectPosition: focal }}
      />
    </div>
  );
}


Replace any raw <img> avatar usages:

Homepage hero: <Avatar src="/images/author.jpg" size={144} />

Article footer: <Avatar src="/images/author.jpg" size={96} />

Parent layout (avoid squeezing the circle):

<div className="grid grid-cols-[auto_1fr] items-center gap-4">
  <Avatar ... />
  <div> ... </div>
</div>


Acceptance: Face fully visible & centered on homepage and in article footers; no layout shift (intrinsic width/height set).

C) Category titles (“Our Core Self-Help Themes…”) — reduce line breaks, keep readable
C1. Grid and min widths

Categories container:

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* cards */}
</div>


Each card wrapper:

<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:min-w-[280px] lg:min-w-[320px]">

C2. Balanced headings, no hyphenation

Category title element:

<h3 className="cat-title text-lg md:text-xl font-semibold tracking-tight leading-tight
               whitespace-normal break-normal hyphens-none">
  Introversion & Personality
</h3>


Add (if not available via Tailwind plugin) to global CSS:

.cat-title { text-wrap: balance; }


Acceptance: Category headings occupy fewer, balanced lines, no awkward splits, clean three-column desktop alignment.

D) CWV & SEO safety checklist (must hold)

CLS: Avatar <img> has explicit width+height. No layout shifts introduced by grid or cards.

LCP: No new blocking CSS/JS.

TBT/INP: No long tasks; sanitizer is O(n) string ops only.

SEO: Do not change canonical logic, JSON-LD counts, or slug generation.

E) Files to add/update (summary)

public/index.html — charset first.

src/components/Seo.js — <meta charSet="utf-8" /> first.

src/lib/content/normalizeDisplayText.js — new.

Apply normalizeDisplayText() to all UI author lines + SEO display titles.

Replace corrupted strings with Marica Šinko across src/blogData.js and any MD/MDX/front-matter.

src/components/AuthorBio.jsx (UTF-8), plus src/components/AuthorBio/index.js.

src/components/Avatar.jsx — new/updated; use in homepage + article footers.

Category section component(s) — grid + min-width + balanced heading class.

Global CSS — .cat-title { text-wrap: balance; } (if needed).

F) Verify (FAST)
npm run mini
npm run fast


Must pass:

“By Marica Šinko” appears exactly everywhere (no �, ?, €, ¢).

Avatar shows full face (homepage + footers) with no CLS.

Category titles are balanced, not split into many tiny rows.

No SEO/CWV regressions.

Return only changed files, each with a one-line comment at the top describing the fix.