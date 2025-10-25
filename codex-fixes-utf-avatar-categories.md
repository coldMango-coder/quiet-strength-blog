CODEX TASK — Fix mojibake (“By Marica �inko”), category title wrapping, and author avatar centering (NO CWV REGRESSIONS)
Non-negotiables (must hold or improve)

Core Web Vitals: keep or improve LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT/INP ≤ 50 ms.

SEO: do not alter canonical/OG/Twitter/JSON-LD counts or logic; no duplicate Article schemas.

Performance: no render-blocking CSS/JS; any new JS must run idle/deferred; no long tasks >50 ms.

Accessibility: WCAG 2.1 AA (focus, contrast, semantics) must remain.

At the end, run:

npm run mini
npm run fast
# (Run npm run full only when asked.)

1) Eliminate “�” mojibake in author name everywhere (“By Marica �inko”)
1.1 Enforce UTF-8 at the document and Helmet levels

public/index.html: ensure the very first meta is exactly:

<meta charset="utf-8" />


src/components/Seo.js (or <Seo> component): add as the first child inside Helmet:

<meta charSet="utf-8" />

1.2 Normalize all display text and protect diacritics

Create src/lib/content/normalizeDisplayText.js:

// Keeps diacritics; removes only stray currency chars and NBSPs; NFC normalizes.
export default function normalizeDisplayText(input) {
  if (typeof input !== 'string') return input;
  const n = input
    .normalize('NFC')
    .replace(/\u00A0/g, ' ')    // NBSP → space
    .replace(/[€¢]/g, '');      // strip stray currency chars if present
  return n;
}


Apply this to display strings only (titles, author lines, breadcrumbs, “By …” rows).
Do not apply to URLs/slugs.

Example in the blog post header component:

import normalizeDisplayText from '@/lib/content/normalizeDisplayText';
// ...
const displayAuthor = normalizeDisplayText(post.author?.name || 'Marica Šinko');
// ...
<p className="text-brand-primary text-base">
  By {displayAuthor} <span className="mx-2">•</span> <time dateTime={post.date}>{formattedDate}</time> <span className="mx-2">•</span> {post.readTime}
</p>

1.3 Fix the source data and read it as UTF-8

Scan repo for corrupted author strings and replace with the correct diacritic:

Replace any "Marica ?inko" or "Marica \uFFFDinko" (or ?inko) with "Marica Šinko" in:

src/blogData.js (or wherever post metadata lives)

any front-matter .md(x) sources

any hard-coded fallbacks

In any Node scripts that read files (prerender/metadata), ensure UTF-8 is passed:

fs.readFileSync(path, 'utf8'); // not Buffer default

1.4 Font fallback safety (only if needed; no performance hit)

Ensure the stack for body/title includes a Latin-Extended fallback (Inter already has it; add a safe fallback):

:root { --font-sans: Inter, "Noto Sans", system-ui, -apple-system, Segoe UI, Roboto, "Helvetica Neue", Arial, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; }
body { font-family: var(--font-sans); }


(Do not add extra font files or blocking loads.)

Acceptance

Browser tab and page text render “Marica Šinko” everywhere (no �).

“By …” line shows Š correctly across all posts.

2) Author avatar: center face, show full picture (homepage & article footers), zero CLS
2.1 Avatar component (single source of truth)

Update/Create src/components/Avatar.jsx and use it both on the homepage hero and in article footers:

// Shows full face with slight upward focal point; intrinsic size prevents CLS.
export default function Avatar({
  src,
  alt = 'Author avatar',
  size = 128,            // px (used for width/height)
  focal = '50% 30%',     // upward bias
  containOnNarrow = true // swap to contain on ultra-narrow screens
}) {
  const imgProps = {
    src,
    alt,
    width: size,
    height: size,
    loading: 'lazy',
    className: 'w-full h-full object-cover',
    style: { objectPosition: focal }
  };
  return (
    <div
      className={[
        'avatar-frame rounded-full overflow-hidden border-4 border-white shadow',
        `w-[${size}px] h-[${size}px]`
      ].join(' ')}
      style={{ width: size, height: size }}
    >
      <img {...imgProps} />
    </div>
  );
}


Global CSS tweak for ultra-narrow devices (optional; tiny rule):

@media (max-width: 360px) {
  .avatar-frame img { object-fit: contain; background: #fff; }
}

2.2 Replace existing avatar usages

Homepage hero author panel and article footer card: replace <img> or old avatar with <Avatar src="/images/author.jpg" size={128} /> (homepage hero can use 144–160).

Ensure containers are square and reserve space (set width/height or aspect-square) to avoid CLS.

Acceptance

Face is fully visible and centered in a neat circle on both homepage and article footers.

No layout jump when avatar loads (intrinsic width/height set).

3) Category titles (“Our Core Self-Help Themes…”) — stop splitting into many short lines
3.1 Grid and min-widths

On the container that renders the category cards:

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* cards */}
</div>


On each card: enforce sensible min widths so titles don’t get squeezed:

<div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200 sm:min-w-[280px] lg:min-w-[320px]">

3.2 Heading balance and wrapping

On the category title element (h3/h4):

<h3 className="cat-title text-balance text-lg md:text-xl font-semibold tracking-tight leading-tight
               whitespace-normal break-normal hyphens-none">
  Introversion & Personality
</h3>


Add this small CSS rule (if Tailwind doesn’t have text-balance in your build):

.cat-title { text-wrap: balance; }

3.3 Body text readability

Body text under the title:

<p className="text-sm md:text-base leading-6">
  Discover actionable strategies…
</p>


Acceptance

Category names render on significantly fewer lines (balanced), no hyphenation, clean spacing.

Cards align neatly in 2–3 columns at breakpoints without overly narrow columns.

4) Scoped ToC isolation & no overlap (kept from prior tasks)

(Keep these if not already in place; they also help the avatar/category layout by avoiding bleed from .prose styles.)

/* Keep ToC isolated from prose/floats */
.qs-toc, .qs-toc * { position: static !important; float: none !important; }
.qs-toc a { display: block !important; }
.prose .qs-toc, .prose .qs-toc * { margin: 0 !important; padding: 0 !important; }

5) CWV & SEO Protections (do not remove)

CLS: every <img> (avatars included) must have width+height or controlled aspect-ratio; no layout shifts.

LCP: do not add blocking CSS/JS; no heavy work in the avatar or category grid.

TBT/INP: no long tasks; any observers/toggles must initialize on requestIdleCallback or setTimeout(0).

SEO: no changes to canonical tags, OG/Twitter metadata, or JSON-LD counts; do not slugify display names; use diacritics for display strings.

6) Files to add/update

public/index.html — ensure <meta charset="utf-8" /> is first.

src/components/Seo.js — ensure <meta charSet="utf-8" /> is first in Helmet.

src/lib/content/normalizeDisplayText.js — new.

Apply normalizeDisplayText() where “By …” or author name appears.

src/components/Avatar.jsx — new or updated; replace old avatar usages in homepage and article footer.

Category section component(s) — grid/min-width and title/body classes as above.

Optional CSS: .cat-title { text-wrap: balance; } and 360px avatar contain rule.

7) Validation (FAST)
npm run mini
npm run fast


Pass criteria

“Marica Šinko” shows correctly in tab title and “By …” rows across posts.

Category titles are not split into many tiny lines; appear clean and balanced.

Author avatar shows full face, nicely centered, no layout shift.

Core Web Vitals unchanged or improved; no SEO/JSON-LD changes or duplicate Article schemas.

Return only changed files, each with a one-line comment at the top describing the change.

If any mojibake persists, it means a specific source file is saved in a non-UTF-8 encoding. In that case, resave that file as UTF-8 (without BOM) and re-run the FAST pipeline; do not change its content semantics.