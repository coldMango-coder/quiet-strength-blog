# Repository Guidelines

## Project Structure & Module Organization
- `src/` – React app code: `components/`, `pages/`, `hooks/`, `lib/` (SEO utilities), `assets/`, `images/`.
- `public/` – Static assets and base `index.html`.
- `scripts/` – Node utilities for SEO, prerender, sitemaps, images, CI checks.
- `tests/` – Playwright end-to-end and performance specs.
- `src/components/__tests__/` – Jest/RTL unit tests and snapshots.
- `data/`, `templates/` – Content inputs (e.g., blog templates) and generators.
- `reports/`, `playwright-report/`, `test-results/` – Generated reports and artifacts.

## Build, Test, and Development Commands
- `nvm use` (Node `18.18.0`) – Use correct runtime (see `.nvmrc`).
- `npm run dev` – Start CRA dev server with project predev hooks.
- `npm run build` – Production build + postbuild optimizations (static pages, perf, images).
- `npm run preview` – Serve `build/` locally.
- `npm test` – Jest unit tests (watch in dev).
- `npm run test:e2e` – Playwright E2E; run `npm run test:install` once per machine.
- Useful: `npm run lighthouse`, `npm run generate-sitemap`, `npm run prerender`.

## Coding Style & Naming Conventions
- JavaScript/React, 2-space indentation, semicolons optional but be consistent.
- Components: PascalCase files in `src/components/` (e.g., `NormalizedLink.js`).
- Hooks: `useX` in `src/hooks/`.
- Prefer functional components, hooks, and Tailwind utility classes.
- Linting: CRA ESLint config (`react-app`, `react-app/jest`). Fix warnings before PR.

## Testing Guidelines
- Unit tests: Jest + React Testing Library; name `*.test.js` near subject or under `__tests__`.
- E2E/Perf: Playwright specs under `tests/`. Generate reports with `npm run test:e2e`.
- Aim for coverage on new/changed logic; snapshot tests for stable UI components.

## Commit & Pull Request Guidelines
- Commits: concise, imperative; optional scope prefix (e.g., `Perf+SEO: reduce CLS on home`).
- PRs: clear description, linked issues, before/after screenshots for UI, note SEO/perf impact.
- Checklist: pass `npm test`, `npm run test:e2e`, and build locally; include relevant report artifacts.

## Security & Configuration Tips
- Copy `.env.example` to `.env.local`; do not commit secrets. Use `.env.production` for deploy.
- Image/SEO tools rely on Node scripts in `scripts/`; run via npm scripts rather than direct node.

1. Accessibility & Semantic HTML

Replace generic <div> wrappers with semantic tags: <header>, <nav>, <main>, <section>, <article>, <aside>, <footer>.

Add descriptive <h1>–<h3> hierarchies. Only one <h1> per page. Articles should have <article> with <h2> titles.

Add aria-labels and alt text for all images, including blog thumbnails, hero images, and book covers.

Ensure keyboard navigation and proper focus states for all interactive elements.

2. Responsive Design & Mobile Fixes

Rebuild the layout using a mobile-first grid with Tailwind (grid, flex, gap, space-y utilities).

Fix the issue where blog images are too small relative to text on mobile. Set images to w-full and use aspect-video or aspect-square for consistent proportions.

Scale fonts with Tailwind’s text-base sm:text-lg md:text-xl classes for readability.

Add generous padding/margin on small screens (p-4 sm:p-6) to avoid cramped UI.

Make the “Latest Insights” cards full-width on mobile with consistent image sizes and text wrapping.

3. Visual Hierarchy & UI/UX

Introduce a sticky top navigation bar with a clear call-to-action button (“Join Newsletter”).

Use Tailwind’s color palette to create better contrast between backgrounds and text. Aim for WCAG AA contrast.

Unify button styles using rounded-2xl px-5 py-3 font-semibold plus a hover state hover:bg-orange-600.

Use consistent card designs for blog posts, testimonials, and books. Include clear image, title, excerpt, and “Read More” or “Buy Now” button.

Add max-w-screen-xl mx-auto to center main content and improve whitespace.

4. Performance & SEO Technicals

Lazy-load images with loading="lazy" and decoding="async".

Optimize all images for webp/avif and serve responsive srcset.

Add canonical tags, meta titles, meta descriptions, and Open Graph/Twitter Card tags.

Add structured data (JSON-LD) for Articles, Books, and Author (schema.org types: Article, Book, Person).

Minify CSS/JS and enable preloading of key fonts.

5. Blog & Article Page Template

Each blog article should be an <article> with <header>, <section> for body, and <footer> for author bio.

Include a sticky table of contents on desktop but collapsible accordion on mobile.

Add author box with name, role, and headshot.

Use Tailwind typography plugin for rich text (prose lg:prose-xl).

6. Newsletter & Lead Magnets

Redesign the newsletter form to be centered, with a clear headline and subtext.

Add field validation and success/error states.

Make the CTA button large and high-contrast.

7. Core Pages & Sections

Home: Hero headline + subhead + two CTA buttons (“Join Community” and “Read Blog”).

“Themes” section: Convert to responsive cards with icons.

“Books” section: Present each book in a clean 2-column grid with book cover left and description right on desktop, stacked on mobile.

Testimonials: Use a carousel or grid with equal card heights.

8. Global Tailwind Improvements

Use container mx-auto with max-w-7xl for page width.

Typography plugin for blog content.

Responsive spacing system.

Dark mode support via dark: variants.

Codex brief: hit 100/100 Perf on mobile and desktop
0) Success criteria

LCP ≤ 1.8s mobile, ≤ 1.2s desktop.

CLS = 0.00.

TBT ≤ 0 ms on test page.

Lighthouse 100/100 Perf + 100/100 SEO + no console errors.

1) Remove render-blocking CSS

Problem: /css/main.a5d24572.css blocks first paint (~150 ms).

Actions

Extract critical CSS for hero, header, base typography. Inline it. Defer the rest.

<!-- HEAD -->
<style id="critical-css">
/* minimal Tailwind output: header, hero, layout shell */
</style>
<link rel="preload" as="style" href="/css/main.a5d24572.css">
<link rel="stylesheet" href="/css/main.a5d24572.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/css/main.a5d24572.css"></noscript>


Ensure Tailwind builds are purged. content globs must include all paths:

// tailwind.config.js
module.exports = {
  content: ["./index.html","./src/**/*.{js,jsx,ts,tsx,mdx}"],
  plugins: [require('@tailwindcss/typography')],
}

2) Fix image delivery (≈580 KiB savings)

Global rules

Convert all raster to AVIF with WebP fallback. Keep originals only for Safari < 16 if needed.

Provide exact intrinsic sizes, srcset, sizes, and fetchpriority.

Components

/* LCP hero image or illustration, if any */
<img
  src="/images/hero-640.avif"
  srcSet="/images/hero-640.avif 640w, /images/hero-960.avif 960w, /images/hero-1280.avif 1280w, /images/hero-1600.avif 1600w"
  sizes="(max-width: 640px) 94vw, (max-width: 1024px) 86vw, 1200px"
  width="1600" height="900"
  alt="Introvert self-help hero"
  fetchPriority="high" decoding="async"
/>

/* Article card thumbnail: displayed 359x239 in screenshots */
<img
  className="w-full aspect-[3/2] object-cover"
  src="/images/confident-woman-360.avif"
  srcSet="/images/confident-woman-360.avif 360w, /images/confident-woman-540.avif 540w, /images/confident-woman-720.avif 720w"
  sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 360px"
  width="360" height="240" loading="lazy" decoding="async" alt="Confident woman"
/>

/* Author avatar: displayed 96x96 */
<img
  className="h-24 w-24 rounded-full"
  src="/images/author-96.avif"
  srcSet="/images/author-96.avif 96w, /images/author-192.avif 192w"
  sizes="96px"
  width="96" height="96" loading="lazy" decoding="async" alt="Marica Šinko"
/>

/* Logo: displayed ~48×32 */
<img
  src="/images/logo-64x42.avif"
  width="64" height="42" alt="Quiet Strength"
/>


Build step

Generate responsive assets:

npx sharp-cli "src/images/*.{jpg,jpeg,png,webp}" \
  --input "src/images" --output "public/images" \
  --avif --quality=45 --resize 360,540,720,960,1280,1600 --withMetadata=false

3) Kill CLS from hero section

Problem: hero <section class="bg-brand-light py-32 md:py-48 ..."> shifts. Fonts and late-loading elements move layout.

Fix

Give all media and icons explicit width/height.

Reserve hero vertical space with a fixed min-height on all breakpoints that matches final layout, or use aspect container.

<section id="home" class="relative bg-brand-light text-brand-dark">
  <div class="container mx-auto px-4">
    <div class="min-h-[56svh] md:min-h-[64svh] grid place-items-center">
      <!-- content -->
    </div>
  </div>
</section>


Preload and font-display:swap for text fonts to avoid FOIT/CLS.

<link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossorigin>
<style>@font-face{font-family:Inter;src:url(/fonts/inter-var.woff2) format('woff2');font-display:swap;font-weight:100 900;font-style:normal}</style>

4) Defer offscreen images

Add loading="lazy" and decoding="async" to all non-LCP images. Wrap below-the-fold sections in priority: low containers if using Next; otherwise, nothing extra.

5) Reduce unused JS (framer-motion chunks)

Problem: 625.a7e9….chunk.js imports large parts of framer-motion.

Fix

Dynamic import motion only where used.

// Before: import { motion } from "framer-motion"
const MotionSection = React.lazy(() => import('./MotionSection'));

// MotionSection.jsx
import { m } from "framer-motion" // tree-shaken alias
export default function MotionSection(){ return <m.div initial={{opacity:0}} whileInView={{opacity:1}} viewport={{once:true}}/> }


Gate gestures/drag modules behind user action. Remove drag/pan where not essential.

Build with /* webpackChunkName: "fm" */ to isolate the library. Verify only ~16–20 KiB is shipped initially.

6) Eliminate 404 chunk errors

Problem: .../js/171...chunk.js and 861...chunk.js 404.

Fix

Purge old chunk references from HTML shell. Ensure HTML only references the current hashed bundles generated by your bundler.

Set long cache with revisioning. Never hardcode stale chunk names.

7) Preconnect and prefetch

The audit shows no useful preconnects. Keep ≤4.

<link rel="preconnect" href="https://trueallyguide.com" crossorigin>


If you serve fonts/analytics from a CDN, add preconnect for those origins only.

Use route prefetch on main internal CTAs if your router supports it.

8) Caching headers and immutable assets

Images, CSS, JS, fonts

Cache-Control: public, max-age=31536000, immutable


HTML

Cache-Control: no-cache


Set proper TTL for /images/person-stretching-…avif and all assets. The audit flagged None.

Example NGINX:

location ~* \.(avif|webp|jpg|jpeg|png|gif|svg|js|css|woff2)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
location = /index.html { add_header Cache-Control "no-cache"; }

9) Security headers (SEO + Best Practices)

Add in server config:

# CSP (enforce)
Content-Security-Policy: default-src 'self'; script-src 'self' 'strict-dynamic' 'nonce-{RANDOM}' https:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; require-trusted-types-for 'script';

# Trusted Types
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Referrer-Policy: strict-origin-when-cross-origin
X-Content-Type-Options: nosniff


Use CSP nonce on inline scripts you cannot move.

10) Canonical URL fix

Problem: Conflicting canonical (https://trueallyguide.com/ vs http://localhost:5173/about/).

Actions

On every page, set one absolute canonical to production only.

<link rel="canonical" href="https://trueallyguide.com/">


Remove any build-time plugin that injects localhost canonicals. For React Router, derive canonical from route meta and process.env.SITE_URL.

11) Color contrast failures

Ensure AA contrast ratio ≥ 4.5:1. Adjust brand tokens.

Example Tailwind tokens:

:root{
  --brand-dark:#0e1726;           /* text on light */
  --brand-emphasis:#0b3b62;       /* links/buttons text */
  --brand-secondary:#ff7a1a;      /* CTA bg */
  --brand-light:#f6f8fb;          /* background */
}


Example CTA:

<a className="inline-flex items-center rounded-full px-6 py-3 font-semibold bg-[var(--brand-secondary)] text-white hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--brand-secondary)]">Read the Blog</a>

12) Mobile visual fixes (images too small vs text)

Make all article cards image-led on mobile.

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  <article className="overflow-hidden rounded-2xl border">
    <img className="w-full aspect-[3/2] object-cover" ... />
    <div className="p-5">
      <h3 className="text-xl font-bold leading-tight">...</h3>
      <p className="mt-2 text-sm text-muted-foreground line-clamp-3">...</p>
    </div>
  </article>
</div>


In “Latest Insights” module, force consistent media ratio (aspect-[3/2]), not auto.

In article pages, hero image w-full max-w-3xl mx-auto aspect-video.

13) LCP tuning

The LCP element is the <h1> per audit. It rendered after 500 ms delay. Reduce custom web font impact with swap and limit font weights actually used.

If a hero image is the intended LCP, give it fetchpriority="high" and place before non-critical scripts. Otherwise keep H1 as LCP and avoid animations on it until after DOMContentLoaded.

14) Avoid forced reflow

Do not query layout in the same frame after DOM writes. In any effect where you call getBoundingClientRect, batch reads before writes.

// Good
requestAnimationFrame(()=>{ const r = el.getBoundingClientRect(); /* compute */ requestAnimationFrame(()=>{ el.style.transform = ... }) })


Remove layout-thrashing scroll listeners. Use passive: true.

15) DOM size housekeeping

Current total elements ≈335. Target ≤250 on home.

Collapse nested wrappers like <div class="space-y-24"> where possible. Prefer semantic <section class="py-16">.

16) Defer non-critical JS
<script type="module" src="/js/main.js" defer></script>


Move analytics to requestIdleCallback.

Use import() for fold-below sections (testimonials, carousel, newsletter).

17) Lighthouse regression guard

Add CI step that fails build if any metric drops:

lhci autorun --assert.assertions."categories:performance">=0.99 \
  --assert.assertions."categories:seo">=1 \
  --assert.assertions."categories:accessibility">=0.98

18) Newsletter form a11y and speed

No external validator libraries for a single field. Use HTML5 type="email" + aria-describedby.

Avoid blocking XHR on first paint. Load form logic after idle.

19) Example <head> for production
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Quiet Strength — Self-Help for Introverted Women</title>
<link rel="canonical" href="https://trueallyguide.com/">

<link rel="preconnect" href="https://trueallyguide.com" crossorigin>
<link rel="preload" as="style" href="/css/main.a5d24572.css">
<link rel="stylesheet" href="/css/main.a5d24572.css" media="print" onload="this.media='all'">
<style id="critical-css">/* minimal above-the-fold */</style>

<link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossorigin>
<meta name="theme-color" content="#0e1726">
<meta property="og:type" content="website">
<meta property="og:url" content="https://trueallyguide.com/">
<meta property="og:title" content="Quiet Strength">
<meta property="og:description" content="Build confidence, manage energy, and thrive as an introvert.">
<meta property="og:image" content="https://trueallyguide.com/images/og-1200x630.png">
<meta name="twitter:card" content="summary_large_image">