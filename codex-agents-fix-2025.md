Fix steps (in order):

Main CSS must load normally

Replace any preload/print-swap for the main stylesheet with a plain, unconditional link:

<link rel="stylesheet" href="/css/main.css">


Remove/disable any rel="preload" + media="print" onload combo for this file.

Remove “invisible first paint” CSS from above-the-fold

Ensure main, #root, hero do NOT use:

content-visibility: auto;
contain-intrinsic-size: ...;


These may be used only below the fold (long lists/footers), not in first-screen containers.

Kill any full-screen overlay or dark body background that blocks content

If a deferred background feature was added (e.g., .bg-texture-enabled):

Default state: no opaque background on body:

body { background-color: #fff; background-image: none; }


Only after idle:

(requestIdleCallback||setTimeout)(() =>
  document.documentElement.classList.add('bg-texture-enabled'), 1500
);

.bg-texture-enabled body {
  background-image: url('/images/paper-texture-optimized.avif'); /* small, transparent-friendly */
  background-size: 600px auto;
}


Remove/disable any default fixed or absolute overlay with inset: 0 that’s mounted by default (modals/backdrops/loader). Overlays must be hidden by default and only shown when triggered.

Replace Tailwind arbitrary grid utilities that can be purged

If markup uses classes like [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))], replace with a stable CSS class:

<div class="posts-grid">…</div>

.posts-grid{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr))}
@media (min-width:1280px){.posts-grid{grid-template-columns:repeat(auto-fit,minmax(360px,1fr));gap:2rem}}


SSR safety: no document/window during server render

If any SEO/canonical code manipulates the DOM, wrap it in useEffect so it runs only in the browser.

Acceptance (must pass before any other change):

Visiting the homepage shows full content (hero/nav/cards) with styles applied (no full-screen dark background).

No console errors on first load.

No score regressions in categories currently at 100.

After this section succeeds: re-apply the CLS & image-sizing fixes that are already in this file (fonts with size-adjust, hero min-height, corrected sizes/srcset) one at a time.

🔧 Addendum: Desktop & Mobile Fixes (Contrast, Canonical, Images, CSS, Lazy-Loading, UI/UX)

⚠️ These instructions are binding. Adapt every fix to the actual code and content of trueallyguide.com.
Do not reduce current Core Web Vitals scores. They may only improve.

A) Desktop: Contrast & Canonical
A1. Fix insufficient color contrast

Failing example:
#newsletter h2 inside <section id="newsletter" class="py-32 bg-brand-dark">

Required:

Achieve WCAG 2.1 AA contrast (≥ 4.5:1 normal text, ≥ 3:1 large text).

Validate with computed styles (after all utilities/overrides).

Implement (example—adapt to palette):

/* Ensure final computed contrast meets AA */
#newsletter {
  /* If bg-brand-dark is too light, darken it */
  background-color: #0d0f12; /* example */
}
#newsletter h2,
#newsletter p,
#newsletter label {
  color: #ffffff; /* or near-white that passes on the chosen background */
}
#newsletter .btn,
#newsletter input[type="email"] {
  /* Ensure text & placeholders meet contrast on backgrounds too */
}


Acceptance: Lighthouse contrast audit passes, manual check at 100% and 200% zoom passes.

A2. Resolve canonical conflicts

Issue: Multiple/conflicting canonicals (/ and /about).

Required:

Exactly one canonical per page.

Homepage:

<link rel="canonical" href="https://trueallyguide.com/">


About page:

<link rel="canonical" href="https://trueallyguide.com/about">


Remove duplicates, avoid dynamic injection that produces conflicts.

Acceptance: Lighthouse “Document has a valid rel=canonical” passes for all routes.

B) Mobile: Images, CSS, Lazy-Loading
B1. Properly size images (target savings ~293 KiB)

Pagespeed flagged:

Article list thumbnails (e.g., “Narcissists…”, “Emotionally Unavailable…”)

Author portrait

Featured article hero

Logo

Required:

Right-size sources to match rendered sizes at each breakpoint.

Generate mobile-specific variants (e.g., 80/96/128/160/192/240/360 px).

Set explicit width/height on every <img> to lock aspect ratio.

Use sizes that mirror layout (don’t claim 92vw if card is limited by container).

Keep .avif/.webp first; keep JPEG fallback in <picture>.

Examples (adapt widths to real layout):

<!-- Grid/list card thumb (~160px on mobile, 240px on tablet, 360px on desktop) -->
<img
  src="/images/article-thumb-240.avif"
  srcset="/images/article-thumb-160.avif 160w,
          /images/article-thumb-240.avif 240w,
          /images/article-thumb-360.avif 360w"
  sizes="(max-width: 640px) 160px, (max-width: 1024px) 240px, 360px"
  width="160" height="107"  <!-- keep real aspect ratio -->
  loading="lazy" decoding="async" fetchpriority="auto"
  alt="…"
  class="w-full h-auto object-cover"
/>


Author portrait (fixed UI slot, e.g., 96–224 px):

<img
  src="/images/marica-sinko-author-photo-128.avif"
  srcset="/images/marica-sinko-author-photo-96.avif 96w,
          /images/marica-sinko-author-photo-128.avif 128w,
          /images/marica-sinko-author-photo-224.avif 224w"
  sizes="(max-width: 640px) 96px, (max-width: 1024px) 128px, 224px"
  width="128" height="128" alt="Marica Šinko – Author portrait"
  loading="lazy" decoding="async" class="w-full h-auto object-cover"
/>


Acceptance: Lighthouse “Properly size images” passes; transfer reductions match or exceed the reported savings.

B2. Eliminate render-blocking CSS (~150 ms)

Flagged: …/css/main.8e1d75fb.css (~14 KiB)

Required (choose one that preserves styling order):

Inline critical CSS for above-the-fold and load rest async.

Or preload + swap:

<link rel="preload" as="style" href="/css/main.8e1d75fb.css" />
<link rel="stylesheet" href="/css/main.8e1d75fb.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/css/main.8e1d75fb.css"></noscript>


Acceptance: Lighthouse “Eliminate render-blocking resources” shows improved/satisfied; no FOUC.

B3. Defer offscreen images (~16 KiB)

Flagged: …/media/paper-texture-background.6f81329….png

Required:

Don’t load non-visible decorative textures early.

Convert to CSS background-image on a non-critical selector and load late (or remove on mobile).

Provide modern format and smaller dimensions.

Example:

/* Default: no heavy texture on initial paint */
body { background-color: #f8f8f6; }

/* Add lightweight texture only after idle */

<script>
  // After TTI or requestIdleCallback
  (requestIdleCallback||setTimeout)(function () {
    document.documentElement.classList.add('bg-texture-enabled');
  }, 2000);
</script>

.bg-texture-enabled body {
  background-image: url('/images/paper-texture-optimized.avif'); /* small, compressed */
  background-size: 600px auto; /* scaled and optimized */
}


Acceptance: Lighthouse “Defer offscreen images” passes; texture loads after interactive.

C) UI/UX: Proportional Images & Typography (Mobile + Desktop)

Problems observed:

Thumbnails vs. titles look unbalanced on mobile.

Mixed languages/symbols on article metadata.

Duplicate “Latest insights” sections; “View all articles” button placement is off.

Required:

C1. Proportional layout & type scale

Card layout: keep thumbnail aspect ratio consistent (e.g., 4:3 or 16:9) and cap height.

Typographic scale: use clamp() for responsive headings & body; ensure line-length ≈ 45–75 ch.

Example (adapt sizes to your design):

/* Thumbnail containers */
.card-thumb {
  aspect-ratio: 4 / 3;        /* or 16/9 site-wide */
  border-radius: 0.75rem;
  overflow: hidden;
}
.card-thumb img { width: 100%; height: 100%; object-fit: cover; }

/* Type scale */
h2.article-title {
  font-weight: 800;
  font-size: clamp(1.1rem, 1rem + 1.5vw, 1.6rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
}
.article-excerpt {
  font-size: clamp(0.95rem, 0.9rem + 0.5vw, 1.05rem);
  line-height: 1.6;
  max-width: 65ch;
}
.meta-row { gap: .5rem; font-size: .875rem; opacity: .85; }


Acceptance: Visual parity with professional blogs (Medium-like). No overflow/awkward crops at common breakpoints (360, 390, 414, 768, 1024, 1280).

C2. Remove duplicate “Latest insights” and fix button placement

Keep only the first “Latest insights” section at the top of the homepage.

Move the “View all articles” button into that first section (right-aligned on desktop, stacked below heading on mobile).

Delete the second duplicate section and any now-orphaned anchor targets.

Acceptance: Exactly one section present; button visible in top section; navigation flows correctly.

C3. Language, diacritics, and “weird symbols” cleanup

Ensure UTF-8 encoding everywhere:

<meta charset="UTF-8">


Verify server sends Content-Type: text/html; charset=UTF-8.

Normalize content strings; correct badge/label text to formal English where English is intended (e.g., category chips, dates, status tags). Preserve Croatian where explicitly desired.

Fix any mojibake (e.g., Marica �inko ➜ Marica Šinko).

Acceptance: No mojibake; consistent locale usage; copy reads in formal English where specified.

D) LCP Image & Priority Hygiene (Re-check after UI changes)

Only one image per page should have fetchpriority="high" (the LCP element).

All other images must be loading="lazy" and not decoding="sync" unless required for LCP.

Ensure the LCP element remains fast after layout/typography adjustments.

Acceptance: Mobile LCP ≤ previous measurement; no regressions.

E) Final Verification & Safeguards

Re-run Lighthouse/PageSpeed for Mobile and Desktop after each change set.

Verify no regression in:

Performance: 100/100

Accessibility: 100/100

Best Practices: 100/100

SEO: 100/100

If any score drops below 100, roll back the offending change or adjust the implementation to maintain 100.

🚫 Non-negotiable Rule

DO NOT change the current Core Web Vitals / Lighthouse scores downward.
They may only stay the same or improve. If a change risks a regression, do not ship it.

🗑️ G) Content Maintenance – Delete Last Published Article (Optional Utility)

Task:
Codex must include the ability to identify and delete the most recently published article from the site’s content source if requested.

Implementation details:

If articles are stored as Markdown/MDX files (e.g., in ./content/posts or ./src/posts), identify the file with the most recent date, publishedAt, or latest modification timestamp and delete that file.

If the site uses a database or CMS API, find the post with the most recent publishedAt timestamp and delete it via the appropriate query or API call.

If direct deletion is risky, move the article into a trash/ or archived/ directory instead of permanent deletion.

Ensure deletion does not break routing, feeds, or index pages. Update any references (e.g., lists, sitemaps, pagination) accordingly.

After deletion, confirm that:

No broken links appear on the homepage, category pages, or sitemap.

No empty sections are left where the article used to be.

H) Desktop CLS Remediation (target CLS ≤ 0.05)

Symptom: Largest shifts on <main id="main-content" class="container mx-auto"> and nav during webfont load.
Goal: Eliminate layout jumps caused by font swap, late content insertion, and unreserved space.

Required fixes:

Webfont metric overrides (no jump between fallback ↔ custom)

/* Example for /fonts/charter-regular.woff2 – tune metrics from actual font info */
@font-face{
  font-family: "Charter";
  src: url("/fonts/charter-regular.woff2") format("woff2");
  font-display: swap;         /* or optional if you prefer no FOIT */
  ascent-override: 92%;       /* tune */
  descent-override: 24%;      /* tune */
  line-gap-override: 0%;
  size-adjust: 98%;           /* tune until fallback & Charter occupy same space */
}
:root{
  font-family: system-ui, -apple-system, Segoe UI, Roboto, "Charter", Arial, sans-serif;
  /* If you prefer Charter first, ensure fallback metrics match via size-adjust above */
}


If you host any external fonts, preload them:

<link rel="preload" as="font" href="/fonts/charter-regular.woff2" type="font/woff2" crossorigin>


Reserve space for hero/LCP block

/* Prevent main headline/hero container from resizing after CSS or font arrives */
.hero-block{
  min-height: clamp(320px, 35vh, 520px); /* tune to real above-the-fold design */
  contain-intrinsic-size: 520px;         /* guards against late content jumps */
  content-visibility: auto;              /* only if not hurting LCP */
}


Any hero image/video: ensure aspect-ratio and explicit width/height.

Nav bar stability

Keep nav on a single line on desktop; prevent wrap when metrics change:

.nav{ white-space: nowrap; }
.nav a{ display:inline-block; }


Avoid adding/removing nav items during hydration. No layout-affecting animations on load (use opacity/transform, not size/position).

No layout-affecting “late” CSS

Ensure any post-hydration classes (e.g., theme switch) don’t change font-size, paddings, or margins in above-the-fold containers.

Acceptance: CLS ≤ 0.05 on Desktop. Lighthouse “Avoid large layout shifts” shows minimal or zero shifts for <main> and <nav>.

I) Desktop “Properly size images” (est. 339 KiB)

Cause: sizes strings do not match actual rendered widths (and there’s a typo like 128p… instead of 128px). Desktop cards/avatars are served larger than needed.

Required fixes:

Fix typos in sizes

Replace any broken value like 128p… → 128px.

Match real card widths

Measure actual rendered image widths at desktop (≥1024px).
Example for square thumbs that render 160/192px:

<img
  src="/images/post-192.avif"
  srcset="/images/post-160.avif 160w,
          /images/post-192.avif 192w"
  sizes="(max-width: 1024px) 160px, 192px"
  width="192" height="192"
  loading="lazy" decoding="async" class="w-full h-auto object-cover" alt="…">


Author portrait (224px slot)

<img
  src="/images/marica-sinko-author-photo-224.avif"
  srcset="/images/marica-sinko-author-photo-160.avif 160w,
          /images/marica-sinko-author-photo-192.avif 192w,
          /images/marica-sinko-author-photo-224.avif 224w"
  sizes="224px"
  width="224" height="224"
  loading="lazy" decoding="async" class="w-full h-auto object-cover" alt="Marica Šinko – Author portrait">


Logo (64px)

<img src="/images/logo-64.avif" sizes="64px" width="64" height="64" loading="lazy" decoding="async" alt="Quiet Strength Logo">


Acceptance: PSI Desktop “Properly size images” cleared (or savings negligible). No regression to LCP/CLS.

J) Canonical Dedupe (Desktop + Mobile)

Issue: Multiple canonicals detected (/ and /about).
Requirement: Exactly one canonical per route. SSR must output one; CSR must not inject another.

Implementation:

Centralize canonical inside a single SEO component and guard against duplicates.

On each route ensure the expected canonical:

Home:

<link rel="canonical" href="https://trueallyguide.com/">


About:

<link rel="canonical" href="https://trueallyguide.com/about">


De-dupe guard (React/Head manager example):

// Only inject if none exists (prevents CSR double-insert)
if (typeof document !== 'undefined' && document.querySelector('link[rel=canonical]')) {
  /* skip */
} else {
  /* insert canonical */
}


Acceptance: View Source (not DevTools) shows one canonical tag per page. Lighthouse SEO passes on Desktop & Mobile.

K) Deprecated API Warning: H1UserAgentFontSizeInSection

Goal: Remove reliance on User Agent defaults for heading sizes.
Action: Explicitly define heading sizes & line-heights in CSS so the UA rule isn’t used.

h1{ font-size: clamp(2rem, 1.4rem + 2vw, 3.5rem); line-height: 1.15; }
h2{ font-size: clamp(1.5rem, 1.2rem + 1.2vw, 2.25rem); line-height: 1.2; }
h3{ font-size: clamp(1.25rem, 1.1rem + .8vw, 1.6rem); line-height: 1.25; }
/* set similar for h4–h6 if used */


Acceptance: Lighthouse “Deprecated APIs” warning disappears.