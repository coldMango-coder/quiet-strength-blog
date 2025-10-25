🚀 PROMPT FOR CODEX (FINAL – FAST MODE ENABLED, DO NOT BREAK SEO OR CORE WEB VITALS)


You are working in a React + Tailwind project (see README).
The site already has server-side SEO, static prerendering, and 100/100 Lighthouse on Performance, Accessibility, Best Practices, and SEO.

🚫 Non-negotiable Constraints

Core Web Vitals must not decrease.
Keep or improve:

LCP ≤ 1.8 s (mobile)

CLS ≤ 0.05

TBT ≤ 50 ms

Do not remove or degrade:

server-HTML canonicals

OG/Twitter tags

JSON-LD schema

sitemap generation

prerender pipeline

caching headers

robots rules

Keep Enhanced SEO implementation fully intact:

Exactly one canonical per page

Correct schema types (WebSite, Organization, Blog, CollectionPage, BlogPosting)

No duplicate Article schemas

External links verified and use target="_blank" rel="noopener noreferrer"

Image naming convention (filename = alt text)

Accessibility (WCAG 2.1 AA) must remain perfect

After implementation, the app must still pass:

npm run build &&
npm run test &&
npm run test:prerender &&
npm run validate:seo:enhanced


and maintain 100/100 Lighthouse mobile + desktop.

🧩 What to Build / Fix (9 UX issues)

(Same as before; unchanged from your spec)

ArticleTOC.jsx – premium sticky/collapsible ToC

sanitizeText.js – strip “€”/“¢”, normalize UTF-8

slugify.js – lodash.deburr ASCII slugs

Avatar.jsx – proper crop & CLS-safe sizing

Category grid – consistent, balanced layout

Featured card – responsive two-column design

Mobile list – uniform [16/10] thumbnails

Thought Record table – accessible zebra table

Meta row – tidy, wraps on mobile, sanitized

(Keep SEO, schema, and CWV protections exactly as written.)

⚙️ FAST MODE Optimization (added section)
Goal
If npm run fast stalls on Windows during “Evaluating node compatibility”, run npm run mini instead to complete the code changes and return the diffs; I (the user) will run npm run fast or FULL=1 npm run full manually afterward.

Avoid multi-browser Playwright and heavy PowerShell scans on local runs.
All 9 fixes and validations must remain functional, but local iterations must complete within minutes.
Full 6-browser matrix runs only when explicitly requested (FULL=1).

Implementation

Update package.json scripts

{
  "scripts": {
    "build": "vite build",
    "test": "vitest run --reporter=basic --threads=false",
    "test:prerender": "playwright test prerender.spec.js",
    "validate:seo:enhanced": "node scripts/validate-enhanced-seo.js",

    "fast:playwright": "playwright test prerender.spec.js --browser=chromium --workers=1 --reporter=line --project='Desktop Chrome'",
    "fast:seo": "node scripts/quick-validate-seo.mjs",
    "fast": "npm run build && npm run test && npm run fast:playwright && npm run fast:seo",
    "full": "npm run build && npm run test && npm run test:prerender && npm run validate:seo:enhanced"
  }
}


Add scripts/quick-validate-seo.mjs

import fs from "node:fs";
import path from "node:path";
import cheerio from "cheerio";

const PAGES = [
  "build/index.html",
  "build/blog/index.html"
];

let errs = 0;
for (const p of PAGES) {
  if (!fs.existsSync(p)) { console.error("Missing:", p); errs++; continue; }
  const html = fs.readFileSync(p, "utf8");
  const $ = cheerio.load(html);
  if (!$('link[rel="canonical"]').attr("href")) { console.error("No canonical in", p); errs++; }
  if ($('script[type="application/ld+json"]').length < 1) { console.error("No JSON-LD in", p); errs++; }
  if (!$('meta[property="og:title"]').length) { console.error("No og:title in", p); errs++; }
  if (!$('meta[name="twitter:card"]').length) { console.error("No twitter:card in", p); errs++; }
}
process.exitCode = errs ? 1 : 0;
if (!errs) console.log("Quick SEO validation passed ✅");


Add src/components/AuthorBio/index.js
(to avoid slow import renames)

export { default } from "../AuthorBio.jsx";


Default command for local Codex runs

npm install
npm run fast


Run the full suite only when requested:

FULL=1 npm run full


1) Update your scripts (use your existing build, not Vite)

Replace the fast-mode scripts in package.json with these builder-agnostic versions that call your existing npm run build:

{
  "scripts": {
    "mini": "npm run build && node scripts/quick-validate-seo.mjs",
    "fast:playwright": "playwright test tests/prerender.spec.js --browser=chromium --workers=1 --reporter=line",
    "fast:seo": "node scripts/quick-validate-seo.mjs",
    "fast": "npm run build && npm run test -- --watchAll=false && npm run fast:playwright && npm run fast:seo",
    "full": "npm run build && npm run test && npm run test:prerender && npm run validate:seo:enhanced"
  }
}


Notes:

mini now uses npm run build (whatever your project’s real build is) + quick SEO check.

fast still runs your unit tests + Chromium-only Playwright + quick SEO.

full remains your long, multi-browser suite for CI or manual use.

2) Keep the quick SEO validator (it’s correct)

Your agent already added scripts/quick-validate-seo.mjs and used Cheerio ESM properly — keep it as-is.

3) Playwright heads-up (first run only)

If Playwright wasn’t installed locally yet:

npx playwright install chromium


(Only needed once per environment.)

4) Ignore the “Vite” mention in your Codex prompt

In your codex-task.md, change the sentence that referenced Vite to the generic version:

FAST MODE: Use npm run fast. If Windows stalls, use npm run mini (which runs npm run build + quick SEO). Run FULL=1 npm run full only when I ask.

5) About “prerender.mjs doesn’t exist”

Your agent noted that a prerender.mjs path might be referenced but missing in your repo. Since FAST doesn’t rely on it, you’re fine. If your README still mentions a prerender script you don’t actually use, either:

Add it back later, or

Remove that reference from README to avoid confusion.

The FULL suite will still run Playwright tests against your built HTML (prerendered or not) as currently configured.

6) What to say to Codex now

Just send this:

Update package.json to use the builder-agnostic scripts exactly as shown in the last message (mini/fast/full). Keep scripts/quick-validate-seo.mjs as-is. Do not reference Vite. Confirm npm run mini and npm run fast both pass locally.

7) Quick sanity run locally (optional)
npm install
npm run mini       # quick build + static SEO check
npm run fast       # build + tests + chromium-only PW + quick SEO
# FULL=1 npm run full  # only if you want the long suite now


That’s it — you’re set. The FAST loop will stay quick, and you still have the FULL suite when you need deep verification.