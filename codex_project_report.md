**Project Overview**
- Framework: Create React App (`react-scripts`) with React Router and React Helmet for SEO. No Next.js/Vite/Astro/Gatsby/Remix.
- Build tool: `react-scripts` 5.0.1 (Webpack/Babel under the hood).
- Node version: `.nvmrc` specifies `18.18.0`.
- Package manager: npm (lockfile `package-lock.json` present; no `yarn.lock`/`pnpm-lock.yaml`).

**Directory Structure**
- Pruned tree (max depth 3; key paths called out):
  - `/public` — static assets, entry HTML, sitemap/robots, Netlify headers/redirects
    - `_headers`, `_redirects`, `robots.txt`, `sitemap.xml`, `atom.xml`, `rss.xml`
    - `/images` — AVIF/WebP/JPEG assets
    - `/fonts` — self‑hosted Inter/Charter and `fonts.css`
    - `index.html` — base HTML shell
  - `/src` — application source
    - `index.js`, `index.css` (Tailwind), `App.js`
    - `/components` — UI, SEO, media utils (e.g., `Seo.js`, `OptimizedImage.js`, `TableOfContents.js`, `BlogCardFixed.jsx`)
    - `/pages` — routed pages (home, blog index, blog slug, category, legal)
    - `/lib` — helpers (SEO URL normalization, slugify, content utils)
    - `/hooks` — `useDynamicSEO`, `useDevCanonicalFallback`
    - `blogData.js` — blog post registry (JS objects referencing React content)
  - `/scripts` — build/prerender utilities (sitemap generation, canonical injection, critters, image optimization)
  - `/tests` — Playwright tests (prerendered SEO, performance, canonical validation)
  - `tailwind.config.js`, `vercel.json`, `.lighthouserc.json`

**Dependencies & Tooling**
- React: `react@18.2.0`, `react-dom@18.2.0`
- Tailwind CSS: `tailwindcss@^3.3.3` with `@tailwindcss/typography@^0.5.16`
- CRA: `react-scripts@5.0.1`
- Router/SEO: `react-router-dom@^6.30.1`, `react-helmet-async@^2.0.5`
- PostCSS/Autoprefixer: no explicit config; CRA bundles PostCSS 8 and Autoprefixer internally
- Notable libs:
  - Build/SSG: `jsdom`, `fs-extra`, `globby`, `sharp`, `critters`
  - Testing: `@playwright/test`, `playwright`, `@testing-library/*`, `jest-dom`, `puppeteer`
  - Utilities: `lodash.deburr`, `cheerio`, `xml2js`
  - Animation: `framer-motion`
  - No MDX/remark/rehype/gray-matter/contentlayer/prisma/zod/date libs detected

**NPM Scripts**
- Dev
  - `dev` / `start`: Start CRA dev server via `react-scripts start` (predev hook runs `scripts/predev.js`).
  - `dev:express`: Custom Express dev server injecting canonicals (`dev-server.js`).
  - `test`, `test:*`: CRA Jest tests; Playwright suites (`tests/*`).
- Build
  - `build` / `build:basic`: CRA production build.
  - `prebuild`: Normalize author encoding.
  - `postbuild`: Optimize images, inline critical CSS with Critters, and apply server-side canonicals (`scripts/apply-canonicals-all.js`).
  - `analyze`: Build then run webpack bundle analyzer.
- SEO/Sitemaps
  - `generate-sitemap`, `generate-sitemap-dynamic`, `sitemap-watch`, `sitemap-status`.
  - `validate:canonicals*`, `seo:validate*`, `mini`, `fast:seo` — quick SEO checks and validators.
- E2E/Perf
  - `lighthouse`: LHCI autorun.
  - `test:prerender`, `fast:playwright`, `full`, `fast`.
- Deploy
  - `deploy:vercel`, `deploy:vercel:token` — Vercel CLI deploy.

**Styling & Design System**
- Tailwind: enabled via `src/index.css` with `@tailwind base/components/utilities`.
  - Content globs: `./public/index.html`, `./src/**/*.{js,jsx,ts,tsx,md,mdx}`, `./templates/**/*.{md,mdx}`.
  - Theme extensions: custom brand colors (light/dark/emphasis), fonts (`Inter`, `Charter`), tuned typography plugin variables, heading/body sizes/line-heights.
  - Plugins: `@tailwindcss/typography`.
- Global CSS: `src/index.css` imports additional files under `src/styles` (toc, typography, layout parity, width enforcers); loaded from `src/index.js`.
- PostCSS: no user `postcss.config.js`; CRA manages PostCSS/Autoprefixer.
- Component libraries: none of shadcn/MUI/Chakra; custom components with some Radix-like behaviors implemented manually; no Radix/HeadlessUI dependency.

**Blog Architecture**
- Content location
  - Primary: JS-driven posts in `src/blogData.js` referencing React components under `src/pages/*`.
  - Secondary/fallback: Markdown articles in `public/*.md` with YAML frontmatter (e.g., `public/how-to-love-yourself-...md`).
- Format
  - JS-based posts: defined as objects with `{ slug, title, description, date, category, component, image, readTime }`.
  - Markdown posts: frontmatter keys include `title`, `slug`, `date`, `datePublished`, `dateModified`, `category`, `description`, `canonical`, `readTime`, `image`, `author`, `keywords`, `ogTitle`, `ogDescription`, `ogImage`, `twitterTitle`, `twitterDescription`, `twitterImage`.
- Parsing
  - At runtime: posts imported from `src/blogData.js`.
  - Build-time: sitemap and prerender scripts regex-extract from `src/blogData.js` and, if needed, frontmatter-like data from `public/*.md` (see `scripts/generate-sitemap*.js`). No MDX/remark pipeline.
- Routing & slug generation
  - Routes set in `src/App.js` using React Router: `/`, `/blog`, `/blog/:slug`, `/category/:categoryName`, `/privacy-policy`, `/terms`, `/book-quiet-confidence`.
  - Category slugs normalized via `categorySlugMap` (hyphenated; no `%26`).
- Features
  - TOC/anchors: `ModernTOC`, `TableOfContents`, `ArticleTOC.jsx`.
  - Images: `<OptimizedImage>` with AVIF/WebP fallback support, intrinsic `width`/`height` assignment; LCP images set to `eager`/`fetchpriority=high` for hero.
  - Reading experience: `ReadingProgress`, `StyledBlockquote`, `StyledList`, `KeyTakeawayBox`.
  - SEO: `Seo.js` via `react-helmet-async`, JSON-LD for `WebSite`/`BlogPosting`/`BreadcrumbList`.
  - Pagination/search: not present.
  - RSS/Atom: static `public/rss.xml` and `public/atom.xml`.
  - Generation: `scripts/apply-canonicals-all.js` writes per-route HTML with exact canonicals into `build/<path>/index.html`.
- Data fetching strategy
  - Static SPA with build-time HTML augmentation for SEO (no SSR). Prerendered route HTML is generated postbuild for target routes.

**Sample Frontmatters (12)**
- JS-driven posts (equivalent frontmatter representation):
  - how-to-stop-attracting-narcissists-9-proven-strategies — title, slug, date: 2025-08-03, category: Relationships & Dating, description, image, readTime
  - how-to-stop-attracting-emotionally-unavailable-men-guide — title, slug, date: 2025-08-03, category: Relationships & Dating, description, image, readTime
  - introvert-networking-tips-without-small-talk-guide — title, slug, date: 2025-07-29, category: Career & Workplace, description, image, readTime
  - how-to-be-confident-as-an-introvert-woman-guide — title, slug, date: 2025-07-28, category: Introversion & Personality, description, image, readTime
  - post-breakup-glow-up-transformation-guide-10-proven-steps-to-become-your-best-self-in-2025 — title, slug, date: 2025-07-28, category: Self-Development, description, image, readTime
  - emotional-manipulation-tactics-narcissist-ex-recovery-12-proven-steps-to-reclaim-your-life-in-2025 — title, slug, date: 2025-07-27, category: Relationships & Dating, description, image, readTime
  - introvert-overwhelmed-by-social-media-8-proven-coping-strategies-that-actually-work-in-2025 — title, slug, date: 2025-07-26, category: Introversion & Personality, description, image, readTime
  - how-to-love-yourself-after-a-toxic-relationship-8-proven-steps-that-actually-work-in-2025 — title, slug, date: 2025-07-24, category: Relationships & Dating, description, image, readTime
  - how-to-speak-up-in-meetings-introvert-strategies-2025 — title, slug, date: 2025-07-22, category: Career & Workplace, description, image, readTime
  - intentional-dating-2025-guide — title, slug, date: 2025-07-21, category: Relationships & Dating, description, image, readTime
  - introvert-social-battery-drained-recovery-methods — title, slug, date: 2025-07-20, category: Introversion & Personality, description, image, readTime
  - how-to-know-if-you-deserve-better-relationship-introvert-woman-guide — title, slug, date: 2025-07-19, category: Relationships & Dating, description, image, readTime
- Markdown example (`public/how-to-love-yourself-after-a-toxic-relationship-...md`):
  - Keys: `title`, `slug`, `date`, `datePublished`, `dateModified`, `category`, `description`, `canonical`, `readTime`, `image`, `author`, `keywords[]`, `ogTitle`, `ogDescription`, `ogImage`, `twitterTitle`, `twitterDescription`, `twitterImage`.

**Blog Components Inventory**
- `Seo.js` — Sets `<title>`, `<meta name="description">`, canonical, OG/Twitter tags, JSON-LD; uses `getCanonicalUrl`.
- `Canonical.js` — Dev fallback canonical insertion with `react-helmet-async`.
- `ModernTOC.jsx` / `TableOfContents.js` / `ArticleTOC.jsx` — Table of contents generation and rendering.
- `OptimizedImage.js` — Responsive `<picture>`/`<img>` with AVIF/WebP, intrinsic sizes, lazy loading (non-LCP), priority flags.
- `BlogCardFixed.jsx` — Post card for listings; used in blog/category pages.
- `AuthorBio.jsx`, `Avatar.jsx`, `SafeAvatar.js` — Author details/avatar rendering.
- `KeyTakeawayBox.js`, `StyledBlockquote.js`, `StyledList.js` — Content presentation components.
- `Newsletter.js` — Newsletter CTA section.
- `Header.js`, `Footer.js`, `Hero.js`, `LatestInsights.jsx`, `TocToggle.js` — Layout and marketing components.
- Source: all under `src/components/*` and `src/pages/*`.

**Routing & Navigation**
- Main routes (`src/App.js`):
  - `/` — Home
  - `/blog` — Blog index
  - `/blog/:slug` — Blog post detail
  - `/category/:categoryName` — Category archive (normalized slugs)
  - `/book-quiet-confidence` — Book landing
  - `/privacy-policy`, `/terms` — Legal
  - fallback `*` — `NotFoundPage`
- Blog index file: `src/pages/BlogListPage.js`
- Blog slug page: `src/pages/BlogPostPage.js` (loads post by `slug` from `sortedBlogPosts`)
- API routes: none (static site). Feeds are static files: `public/rss.xml`, `public/atom.xml`.

**Build & Deployment**
- Build output: CRA emits `build/` with hashed assets. Postbuild scripts create per-route HTML files in `build/<path>/index.html` with exact canonicals and metadata.
- Commands: `npm run build` → `prebuild` → CRA build → `postbuild` (optimize images, `critters`, apply canonicals).
- Environment variables (names only): `REACT_APP_SITE_URL`, `NEXT_PUBLIC_SITE_URL`, `NODE_ENV`, `REACT_APP_ENABLE_SW`, `REACT_APP_COMMIT_SHA`, `VERCEL_GIT_COMMIT_SHA`, `VERCEL_GIT_COMMIT_TIMESTAMP`, `HOST`, `SITE_URL`, `PUBLIC_URL`, `IMG_VERSION`, `PORT`, `DOM`, `SLUGS`, `PROD_URL`.
- Static vs server: Static SPA with postbuild HTML augmentation; no server runtime/ISR.
- Rewrites/redirects:
  - Netlify (`public/_redirects`): correct single-hop 301s to `https://trueallyguide.com` (non‑www), plus category slug normalizations and SPA HTML serving.
  - Vercel (`vercel.json`): rewrites to `index.html`; static cache headers set. Note: current `vercel.json` includes redirects to `www.trueallyguide.com` (mismatch with non‑www canonical host used elsewhere).
- Caching headers:
  - Netlify `_headers`: static assets/images/fonts 1‑year immutable; HTML `must-revalidate`.
  - Vercel `headers`: mirrors long caching for `/static`, `/images`, `/assets` and `must-revalidate` for `/` and `/index.html`.
- Lint/format/test: CRA ESLint preset (`eslintConfig` extends `react-app`); Playwright tests; no Prettier config detected.

**Quickstart for New Contributors**
- Prereqs: Node `18.18.0`, npm.
- Install: `npm install`
- Run dev (CRA): `npm run dev` (or `npm start`)
- Alt dev server with server-injected canonicals: `npm run dev:express` (serves `public/` on port 3002).
- Build: `npm run build`
- Preview static build: `npm run preview` (serves `build/`)
- Sitemaps: `npm run generate-sitemap` (or `generate-sitemap-dynamic`)
- Tests:
  - Unit/Jest: `npm test`
  - Playwright E2E/SEO: `npm run test:prerender`, `npm run fast:playwright`
- Gotchas:
  - Canonical host policy: code and Netlify rules enforce `https://trueallyguide.com` (non‑www). `vercel.json` currently redirects to `www.trueallyguide.com` and should be aligned if deploying to Vercel.
  - MDX not used; posts are primarily React components referenced from `src/blogData.js`. Markdown files under `public/` are used by scripts and as content sources but are not parsed via a markdown pipeline at runtime.
  - Postbuild step `scripts/apply-canonicals-all.js` must run (it is wired into `postbuild`) for correct per‑route canonical/meta in `build/`.
  - No explicit `postcss.config.js`; Tailwind works through CRA PostCSS pipeline.

