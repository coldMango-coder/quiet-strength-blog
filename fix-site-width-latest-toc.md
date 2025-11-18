# FIX: unified width parity (footer = content), bombastic mobile hero, ToC alignment — NO CWV REGRESSION

## NON-NEGOTIABLES
- **Do not** introduce render-blocking CSS/JS.
- **Preserve or improve** CLS/LCP/INP. All images in touched sections must keep width/height (or aspect-ratio) to avoid CLS.
- Print every change and a short validation report at the end.

---

## 0) DISCOVERY — FIND CONFLICTS FIRST (React/Tailwind/CSS)

### 0.1 Print Tailwind + global CSS
```bash
# Tailwind + PostCSS
ls -la tailwind.config.* postcss.config.* || true
cat tailwind.config.* || true
cat postcss.config.* || true

# Global styles (common names)
rg -n --no-ignore -S "container|max-width|@layer|typography" -- \
  "src/**/*.css" "src/**/*.scss" "src/**/*.tsx" "src/**/*.jsx" "public/**/*.css" || true
0.2 Find wrappers that cap width or fight layout
bash
Copy code
rg -n --no-ignore -S "max-width|width:.*rem|float|position:\s*absolute|overflow-x|overflow-y" -- \
  "src/**/*.{css,scss,tsx,jsx}" "public/**/*.css" | sed -n '1,200p'
0.3 Identify the footer’s real container and its width
Open the built site locally (or the dev server) and run this in the browser console on Home and a Category page:

js
Copy code
(() => {
  const cand = [
    '.footer-inner', 'footer .container', '.footer-wrap', 'footer .max-w-screen-xl', 'footer [class*="max-w-"]'
  ];
  let node = null;
  for (const sel of cand) { node = document.querySelector(sel); if (node) break; }
  if (!node) node = document.querySelector('footer');
  const cs = node ? getComputedStyle(node) : null;
  return {
    footerSelector: node ? node.tagName + '.' + [...node.classList].join('.') : '(footer)',
    footerMaxWidth: cs ? cs.maxWidth : 'auto',
    footerWidth: cs ? cs.width : 'auto'
  };
})();
Record the numeric max width (e.g., 1280px or 80rem). This will become --page-max.

1) CREATE ONE SHARED WIDTH VARIABLE & APPLY IT EVERYWHERE
1.1 Add src/styles/width-parity.css (create file)
css
Copy code
:root{
  /* Replace with footer's computed max-width from step 0.3 */
  --page-max: 80rem; /* if footer is 1280px use 80rem, if 72rem then 72rem, etc. */
  --pad-sm: 1rem; --pad-md: 1.5rem; --pad-lg: 2rem;
}

/* Apply same width to all major wrappers (Home, Category, and Footer) */
.container-wide,
#latest, .latest,
.archive-wrap, .category-wrap,
.main-wrap, .content-wrap, .site-wrap {
  max-width: var(--page-max) !important;
  margin-inline: auto !important;
  padding-inline: var(--pad-sm) !important;
}

/* Footer must use same var (parity) */
.footer-inner, footer .container, .footer-wrap {
  max-width: var(--page-max) !important;
  margin-inline: auto !important;
  padding-inline: var(--pad-sm) !important;
}

/* Responsive padding */
@media (min-width:640px){
  .container-wide, #latest, .latest, .archive-wrap, .category-wrap,
  .main-wrap, .content-wrap, .site-wrap,
  .footer-inner, footer .container, .footer-wrap {
    padding-inline: var(--pad-md) !important;
  }
}
@media (min-width:1024px){
  .container-wide, #latest, .latest, .archive-wrap, .category-wrap,
  .main-wrap, .content-wrap, .site-wrap,
  .footer-inner, footer .container, .footer-wrap {
    padding-inline: var(--pad-lg) !important;
  }
}

/* Neutralize any smaller caps that undo parity */
[class*="max-w-3xl"], [class*="max-w-4xl"], [class*="max-w-5xl"], [class*="max-w-6xl"]{
  max-width: var(--page-max) !important;
}
1.2 Import once (no render blocking)
If you have a global entry (e.g., src/index.css or src/App.css), append:

css
Copy code
@import "./styles/width-parity.css";
If using Tailwind, ensure this @import appears after Tailwind layers so our rules win, or wrap it with @layer utilities and bump specificity as needed.

1.3 Wire wrappers to parity
Ensure these pages/components use one of: .container-wide, #latest, .archive-wrap, .category-wrap, .content-wrap.

Home: wrap the Latest Insights section in an element with id="latest" and class="container-wide latest-grid".

Category page outer wrapper: .archive-wrap or .category-wrap.

2) LATEST INSIGHTS — BOMBRASTIC MOBILE HERO (NO CLS)
2.1 Update LatestInsights markup
Open the component (e.g., src/components/LatestInsights.jsx|tsx) and ensure exactly this structure:

tsx
Copy code
export default function LatestInsights({ featured, items }) {
  // Only 6 items on the right, keeps the section compact
  const right = (items || []).slice(0, 6);

  return (
    <section id="latest" className="container-wide latest-grid my-8">
      <article className="featured-card rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
        <a href={featured.href} className="block mb-4 rounded-xl overflow-hidden featured-thumb">
          <img
            src={featured.image}
            alt={featured.title}
            width={1200} height={675}           // 16:9 to reserve layout
            className="w-full h-auto object-cover"
            loading="lazy" decoding="async"
          />
        </a>
        <h3 className="featured-title text-2xl md:text-3xl font-extrabold leading-tight mb-2">
          {featured.title}
        </h3>
        <p className="featured-excerpt text-[15px] md:text-base text-black/70 line-clamp-3">
          {featured.excerpt}
        </p>
      </article>

      <ul className="mini-list space-y-5">
        {right.map(p => (
          <li key={p.href} className="flex items-start gap-3">
            <a href={p.href} className="block rounded-md overflow-hidden shrink-0">
              <img
                src={p.image}
                alt={p.title}
                width={104} height={104}
                className="block object-cover"
                loading="lazy" decoding="async"
              />
            </a>
            <div className="min-w-0">
              <a href={p.href} className="block font-semibold leading-snug truncate">
                {p.title}
              </a>
              <p className="text-sm text-black/70 line-clamp-2">{p.excerpt}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
2.2 Add responsive grid + mobile hero CSS
Append to src/styles/width-parity.css:

css
Copy code
/* Desktop grid: 2fr/1fr */
.latest-grid{ display:grid; grid-template-columns:1fr; gap:1.5rem; }
@media (min-width:1024px){ .latest-grid{ grid-template-columns:minmax(0,2fr) minmax(0,1fr); } }

/* Hero image — larger & modern on mobile */
.featured-thumb img{ aspect-ratio: 16/9; object-fit: cover; width:100%; height:auto; display:block; }

@media (max-width: 639.98px){
  .featured-card{ padding: 1rem 1rem 1.25rem 1rem; }
  .featured-thumb{ margin-bottom: .75rem; }
  .featured-thumb img{ aspect-ratio: 4/3; }       /* Taller hero, more visual punch */
  .featured-title{ font-size: 1.5rem; line-height: 1.25; } /* bigger */
  .featured-excerpt{ font-size: .95rem; }
}

/* Right list thumbs stay readable without squashing text */
.mini-list img{ width:104px; height:104px; aspect-ratio:1/1; object-fit:cover; }
Why CWV-safe: Images have width/height; aspect-ratio prevents layout shift; CSS only.

3) TABLE OF CONTENTS — PERFECT NUMBER ALIGNMENT
Your ToC uses <details><summary>Table of Contents</summary><ol>...</ol></details> or a .toc-shell wrapper. Normalize list padding & markers so every numeral (incl. last) aligns.

Add to src/styles/width-parity.css (scoped to your wrapper; update selector if needed):

css
Copy code
/* ToC consistent alignment */
.toc-shell .toc-list,
details.toc-shell ol {
  list-style: decimal;
  list-style-position: outside;
  margin: 0;
  padding-left: 1.25rem;      /* constant baseline */
}
.toc-shell .toc-list > li,
details.toc-shell ol > li {
  margin: 0;
  padding: .125rem 0;
  text-indent: 0;
}
.toc-shell .toc-list > li::marker,
details.toc-shell ol > li::marker {
  font-variant-numeric: tabular-nums; /* equal digit width */
}

/* Kill any special-case padding on last item that caused the drift */
.toc-shell .toc-list > li:last-child,
details.toc-shell ol > li:last-child {
  padding-left: 0 !important;
  margin-left: 0 !important;
}
If your ToC uses different selectors, print the wrapper and swap .toc-shell/.toc-list accordingly.

4) REMOVE/OVERRIDE CONFLICTS
4.1 Tailwind config sanity
Print tailwind.config.* and ensure content paths include all app files:

js
Copy code
// tailwind.config.(js|ts)
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./public/**/*.html"
  ],
  // keep your theme/plugins…
}
If there’s a custom theme.container maxWidth that fights --page-max, remove it or set it to match --page-max.

4.2 Kill legacy caps & floats
Search and disable or override any rules narrowing these wrappers:

#latest, .latest, .archive-wrap, .category-wrap, .container, .content-wrap, .site-wrap

Any max-width: smaller than --page-max

Any float/position:absolute used for layout in Latest/Category sections

Any ToC rule giving extra left padding to the last <li>

Example override block (append in width-parity.css as needed):

css
Copy code
#latest, .latest, .archive-wrap, .category-wrap, .content-wrap { float:none !important; position:static !important; }
Do not delete global resets; prefer scoped overrides.

5) VALIDATION — PRINT THESE BEFORE/AFTER
Width parity (Home & Category):

computed max-width of #latest equals footer container

computed max-width of .archive-wrap equals footer container

Mobile hero:

Featured image aspect ratio reported as 4:3

Featured title font-size ≥ 1.5rem

Right list: exactly 6 items rendered, each with thumbnail ~104px; titles not truncated mid-word on first line.

ToC: padding-left for first and last <li> is identical; ::marker uses tabular-nums.

CWV quick check: Run a local Lighthouse (desktop) on Home & one Category page; print CLS/LCP deltas (must not worsen).

Example quick console probes (run on live pages):

js
Copy code
// width parity
(() => {
  const sel = s => document.querySelector(s);
  const cs = el => el && getComputedStyle(el);
  const footer = sel('.footer-inner, footer .container, .footer-wrap, footer');
  const latest = sel('#latest, .latest');
  const arch   = sel('.archive-wrap, .category-wrap');

  return {
    footerMax: cs(footer)?.maxWidth,
    latestMax: cs(latest)?.maxWidth,
    categoryMax: cs(arch)?.maxWidth
  };
})();

// ToC equality
(() => {
  const last = document.querySelector('.toc-shell ol li:last-child, details.toc-shell ol li:last-child');
  const first = document.querySelector('.toc-shell ol li:first-child, details.toc-shell ol li:first-child');
  const c = el => el && getComputedStyle(el);
  return {
    firstPadLeft: c(first)?.paddingLeft,
    lastPadLeft: c(last)?.paddingLeft
  };
})();
END: Print

Which files you edited/created

The final value of --page-max you set

Any conflicting rules you neutralized