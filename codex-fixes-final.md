CODEX TASK — Final polish: ToC UX (mobile + desktop), avatar centering, category headings, UTF-8 mojibake

Do NOT regress SEO or Core Web Vitals. Only equal or better.

Non-negotiables (must hold or improve)

Core Web Vitals targets remain at or above current: LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT/INP ≤ 50ms.

Keep Enhanced SEO exactly working: one canonical per page, correct JSON-LD (WebSite/Organization/Blog/CollectionPage/BlogPosting), OG/Twitter complete, no duplicate Article schemas.

Keep prerender pipeline, sitemap, robots, caching headers, link normalization.

Accessibility: WCAG 2.1 AA (focus rings, ARIA, contrast).

New JS must be light, idle/deferred, no long tasks > 50ms, no render-blocking CSS.

At the end, run:

npm run mini
npm run fast
# (Run `npm run full` only if I ask.)

1) Professional ToC on both mobile & desktop

Problems:

Mobile toggle looks unprofessional and still overlays/bleeds into content.

Desktop lacks the same toggle option.

Links must be dark orange.

ToC must never overlap article text or media.

Goals:

One consistent ToC component with:

Show/Hide button on both mobile and desktop (default: visible on desktop, hidden on mobile).

Dark-orange links: text-orange-700 hover:text-orange-800 hover:underline.

Hierarchy: H2 numbered; nested H3 bullets.

No inner scroll; the page scrolls.

No overlap with article content; fully isolated from .prose and floats.

Implement (update src/components/ArticleTOC.jsx)

Wrapper classes (add/ensure):
qs-toc not-prose relative isolate z-30 clear-both rounded-xl bg-white shadow-sm ring-1 ring-neutral-200

Sticky only on desktop: sm:sticky sm:top-24

Toggle button (same component renders on both desktop and mobile):

Desktop: show Compact “Hide ToC” button (top-right in card header).

Mobile: show Primary “Show/Hide” button (full-width) — styled, not default.

Button style (Tailwind):

Base: inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white px-4 py-1.5 text-sm font-medium text-orange-700 shadow-sm hover:bg-orange-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400

Chevron icon rotates on open/close.

Remove any max-h/overflow-y-auto on the panel. No nested scrollbars.

Ensure style isolation from .prose:

Keep wrapper not-prose.

Also add scoped resets in global CSS (see §5).

Hierarchy rendering

Convert your flat items with level into grouped H2 + H3 children (keep anchors unchanged).

H2 list uses ol.list-decimal; H3 uses ul.list-disc nested.

Z-index & overlap fix

Wrapper has relative isolate z-30 clear-both.

Ensure ToC is outside of .prose and not inside any <p>.

2) Mobile overlay bleeding into article content

Fixes (in ToC placement)

In every post template, render ToC as a sibling to .prose:

<section className="not-prose mb-6">
  <ArticleTOC items={tocItems} accent="orange" collapsibleMobile />
</section>
<article className="prose">
  {/* content */}
</article>


If you use a two-column layout, ToC goes in the sidebar column (outside .prose).

No position:absolute in ToC; no negative margins.

Add global scoped resets (see §5) to neutralize any float/position from content near ToC.

3) Author avatar shows half the face / weird alignment

Goal: Always show the whole face; tasteful crop; zero CLS. Works in hero and in AuthorBio card.

Update or create src/components/Avatar.jsx and switch usages:

Container: aspect-square rounded-full overflow-hidden border-4 border-white shadow w-28 h-28 sm:w-32 sm:h-32

Image:

className="w-full h-full object-cover"

width & height props = container px to prevent CLS

Default focal point upward: style={{ objectPosition: '50% 30%' }}

On narrow mobile (≤360px), fallback to object-contain to avoid cropping the chin/forehead:

@media (max-width: 360px) {
  .avatar--contain img { object-fit: contain !important; background: #fff; }
}


Allow focal and fitMode props (default fit cover, focal "50% 30%").

Replace author spots (hero and bio cards) with this Avatar component. Ensure containers reserve space (intrinsic width/height on <img>).

4) Desktop author image “weird format”

In hero/author section, avoid squeezing the circular frame into too small a column.

Use a simple grid:

Wrapper: grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-6 items-center

Avatar cell fixed; text cell fills.

Typography: leading-snug md:leading-normal, no forced hyphenation.

5) Category names split into many lines (unreadable)

Goal: Fewer lines; clean, professional cards.

Update Category tiles

Grid wrapper: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6

Card min widths: sm:min-w-[280px] lg:min-w-[320px] (prevents skinny columns)

Headings:

text-balance (or CSS: text-wrap: balance;)

whitespace-normal break-words break-normal hyphens-none tracking-tight leading-tight

Size: text-lg md:text-xl with clamp() if you use custom CSS:

.cat-title { font-size: clamp(1.05rem, 1.6vw, 1.25rem); }


Body text: text-sm md:text-base leading-6

Ensure icons + headings don’t force narrow containers (avoid max-w-xs on the title).

6) “�/�” mojibake persists (tab title and “By Marica �inko” lines)

Goal: UTF-8 everywhere, no replacement glyphs.

Actions

First <meta> in public/index.html:

<meta charset="utf-8" />


It must be the very first meta. Do not duplicate—enforce order.

In src/components/Seo.js (Helmet block):
Add <meta charSet="utf-8" /> as the first child; do not slugify display strings. Titles/OG/Twitter use display values with diacritics.

Content sanitization
Ensure all UI text (author lines, meta rows, headings rendered from MD/MDX) pass through sanitizeText() that:

Normalizes to NFC,

Converts NBSP to normal space,

Removes the specific stray characters € and ¢ if present outside words,

Does not strip valid diacritics.

File encoding fix
If any source file is still non-UTF-8 (e.g., old AuthorBio.js), replace it with AuthorBio.jsx saved as UTF-8 and update imports. (You already have an index.js re-export pattern; continue that approach.)

Response headers (keep if already present; otherwise add) in vercel.json for HTML:

{
  "source": "/(.*)",
  "headers": [
    { "key": "Content-Type", "value": "text/html; charset=utf-8" }
  ]
}


Acceptance

Browser tab shows “Marica Šinko” correctly.

“By Marica Šinko” renders correctly on every article.

No � anywhere in UI.

7) ToC link color must be dark orange (and active state)

H2/H3 links: text-orange-700 hover:text-orange-800 hover:underline

Active item: font-semibold text-orange-800 border-orange-600

Keep accessibly visible focus ring.

8) Scoped CSS resets (prevent .prose bleed & overlap)

Add to global CSS (Tailwind @layer base or main CSS):

/* ToC isolation & mobile safety */
.qs-toc, .qs-toc * { position: static !important; float: none !important; }
.qs-toc a { display: block !important; }
.prose .qs-toc, .prose .qs-toc * { margin: 0 !important; padding: 0 !important; }

/* Balanced headings for category cards (if Tailwind plugin not used) */
.cat-title { text-wrap: balance; }

9) Performance & SEO safeguards (must hold)

CLS: Every <img> in avatar/category cards has width+height or aspect-*. No layout shifts from sticky ToC (desktop only; mobile non-sticky).

LCP: No new blocking CSS/JS. ToC observer created on idle.

TBT/INP: No heavy observers; minimal state changes.

SEO: Same anchor ids; no additional canonicals; JSON-LD unchanged.

10) Files to add/update (summary)

src/components/ArticleTOC.jsx — professional toggle, dark-orange links, hierarchy, no inner scroll, isolated, desktop sticky only.

src/components/Avatar.jsx — centered face, objectPosition: '50% 30%', fallback object-contain for tiny screens, intrinsic width/height.

Category section component(s) — grid + heading/body typography tweaks above.

public/index.html — ensure charset first meta only.

src/components/Seo.js — <meta charSet="utf-8" /> first; pass display strings (diacritics intact).

Replace any non-UTF-8 file (e.g., AuthorBio.jsx), update imports.

Global CSS — scoped ToC resets and .cat-title balance rule.

11) Validate (FAST)
npm run mini
npm run fast


Pass criteria

ToC: dark-orange links; H2 numbered with nested H3; Show/Hide button looks premium on both mobile & desktop; no overlap with content; no inner scrollbar; on mobile default hidden, on desktop default visible (but hides if user clicks).

Avatar: shows the whole face; centered; zero CLS.

Categories: headings no longer break into many tiny lines.

Encoding: “Marica Šinko” correct in tab and “By …” rows; no “�/�”.

SEO/CWV: unchanged or improved; no duplicate Article schemas.

Return only changed files, each with a 1-line comment at the top describing the fix.