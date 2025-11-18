# FINAL: Width parity with footer, big mobile hero, ToC alignment — NO CWV regression

## RULES
- Do NOT add render-blocking CSS/JS.
- Images touched must have width/height or aspect-ratio to avoid CLS.
- Keep the right column in Latest to 6 items max.
- Print a short before/after validation report at the end.

---

## 0) DISCOVERY (find real selectors & conflicts)

### 0.1 Tailwind config & global styles
```bash
ls -la tailwind.config.* postcss.config.* || true
cat tailwind.config.* || true
cat postcss.config.* || true
rg -n --no-ignore -S "container|max-width|@layer|typography|--page-max" -- \
  "src/**/*.{css,scss,tsx,jsx}" "public/**/*.css" || true
0.2 Layout wrappers that cap width
bash
Copy code
rg -n --no-ignore -S "max-width|width:\s*\d+(px|rem)|float|position:\s*absolute" -- \
  "src/**/*.{css,scss,tsx,jsx}" "public/**/*.css" | sed -n '1,200p'
0.3 Find the footer inner container selector and its computed max-width (Home + Category route)
Open in a browser and run:

js
Copy code
(() => {
  const footerNode =
    document.querySelector('.footer-inner') ||
    document.querySelector('footer .container') ||
    document.querySelector('.footer-wrap') ||
    document.querySelector('footer');

  const cs = footerNode ? getComputedStyle(footerNode) : null;
  return {
    footerSelector: footerNode ? (footerNode.tagName + '.' + [...footerNode.classList].join('.')) : '(footer)',
    footerMaxWidth: cs?.maxWidth || 'auto',
    footerWidth: cs?.width || 'auto'
  };
})();
Copy the footerMaxWidth value (e.g. 1280px or 72rem) — this becomes --page-max.

1) SITE-WIDE WIDTH PARITY (footer = content)
1.1 Create src/styles/parity.css
css
Copy code
:root{
  /* Replace value below with the real computed footerMaxWidth from step 0.3 */
  --page-max: 80rem; /* e.g. 80rem == 1280px; set to EXACT footer max */
  --pad-sm: 1rem; --pad-md: 1.5rem; --pad-lg: 2rem;
}

/* Apply same width to main wrappers on every page */
.container-parity,
#latest, .latest,
.archive-wrap, .category-wrap,
.main-wrap, .content-wrap, .site-wrap {
  max-width: var(--page-max) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: var(--pad-sm) !important;
  padding-right: var(--pad-sm) !important;
}

/* Footer gets same width (parity) */
.footer-inner, footer .container, .footer-wrap {
  max-width: var(--page-max) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: var(--pad-sm) !important;
  padding-right: var(--pad-sm) !important;
}

/* Responsive padding bumps */
@media (min-width:640px){
  .container-parity,
  #latest, .latest,
  .archive-wrap, .category-wrap,
  .main-wrap, .content-wrap, .site-wrap,
  .footer-inner, footer .container, .footer-wrap {
    padding-left: var(--pad-md) !important;
    padding-right: var(--pad-md) !important;
  }
}
@media (min-width:1024px){
  .container-parity,
  #latest, .latest,
  .archive-wrap, .category-wrap,
  .main-wrap, .content-wrap, .site-wrap,
  .footer-inner, footer .container, .footer-wrap {
    padding-left: var(--pad-lg) !important;
    padding-right: var(--pad-lg) !important;
  }
}

/* Neutralize smaller max-w- utilities that fight parity */
[class*="max-w-3xl"], [class*="max-w-4xl"], [class*="max-w-5xl"], [class*="max-w-6xl"] {
  max-width: var(--page-max) !important;
}

/* Kill legacy floats/absolute that cause narrow columns in parity zones */
#latest, .latest, .archive-wrap, .category-wrap, .content-wrap {
  float: none !important; position: static !important;
}
1.2 Import once (after Tailwind in your global entry)
In src/index.css or src/App.css (where Tailwind is imported), add at the end:

css
Copy code
@import "./styles/parity.css";
1.3 Ensure key pages use these wrappers
Home main wrapper: add class="container-parity" to the top-level content wrapper (the one that contains the hero + Latest Insights section).

Category page wrapper: ensure the list area has class .archive-wrap or .category-wrap.

Latest Insights outer section MUST have id="latest".

2) LATEST INSIGHTS — BIG MOBILE HERO, CLEAN RIGHT LIST (≤6) — CLS-SAFE
2.1 Patch the Latest Insights component (find it by heading “Latest Insights”)
Replace its outer markup with:

tsx
Copy code
<section id="latest" className="latest-grid my-8">
  <article className="featured-card rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
    <a href={featured.href} className="block mb-4 rounded-xl overflow-hidden featured-thumb">
      <img
        src={featured.image}
        alt={featured.title}
        width={1200} height={675}        // 16:9 to reserve layout
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
    {(items || []).slice(0,6).map(p => (
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
          <a href={p.href} className="block font-semibold leading-snug line-clamp-2">
            {p.title}
          </a>
          <p className="text-sm text-black/70 line-clamp-2">{p.excerpt}</p>
        </div>
      </li>
    ))}
  </ul>
</section>
2.2 Add responsive grid + hero CSS (append to src/styles/parity.css)
css
Copy code
/* 2-col on desktop, 1-col on mobile */
.latest-grid{ display:grid; grid-template-columns:1fr; gap:1.5rem; }
@media (min-width:1024px){
  .latest-grid{ grid-template-columns:minmax(0,2fr) minmax(0,1fr); }
}

/* Bolder hero on mobile (taller aspect) */
.featured-thumb img{ aspect-ratio:16/9; object-fit:cover; width:100%; height:auto; display:block; }
@media (max-width:639.98px){
  .featured-thumb img{ aspect-ratio:4/3; }        /* more bombastic mobile visual */
  .featured-title{ font-size:1.5rem; line-height:1.25; }
}
.mini-list img{ width:104px; height:104px; aspect-ratio:1/1; object-fit:cover; }
Why CWV safe: width/height + aspect-ratio prevent CLS; no render-blocking.

3) ToC — last number alignment fix (identical left padding)
Append to src/styles/parity.css (adjust selector to your ToC wrapper if different):

css
Copy code
/* Normalize ToC indentation */
.toc-shell ol,
details.toc-shell > ol {
  list-style: decimal;
  list-style-position: outside;
  margin: 0;
  padding-left: 1.25rem !important;
}
.toc-shell ol > li,
details.toc-shell > ol > li {
  margin: 0;
  padding: .125rem 0;
  text-indent: 0;
}
.toc-shell ol > li::marker,
details.toc-shell > ol > li::marker{
  font-variant-numeric: tabular-nums; /* equal digit width */
}

/* Ensure the last item has exactly the same left padding as the first */
.toc-shell ol > li:last-child,
details.toc-shell > ol > li:last-child {
  padding-left: 0 !important;
  margin-left: 0 !important;
}
4) Tailwind sanity (avoid hidden caps)
In tailwind.config.(js|ts), ensure:

js
Copy code
module.exports = {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}","./public/**/*.html"],
  theme:{ /* leave container unset or match --page-max if you must */ },
  plugins:[require('@tailwindcss/line-clamp')],
}
Remove or align any theme.container that caps smaller than --page-max.

5) VALIDATION — print these in the console
Width parity equals footer (Home & Category):

js
Copy code
(() => {
  const sel = s => document.querySelector(s);
  const cs = el => el && getComputedStyle(el);
  const footer = sel('.footer-inner, footer .container, .footer-wrap, footer');
  const latest = sel('#latest, .latest');
  const archive = sel('.archive-wrap, .category-wrap');
  return {
    footerMax: cs(footer)?.maxWidth, latestMax: cs(latest)?.maxWidth, categoryMax: cs(archive)?.maxWidth
  };
})();
ToC first vs last li padding:

js
Copy code
(() => {
  const q = s => document.querySelector(s);
  const first = q('.toc-shell ol li:first-child, details.toc-shell > ol > li:first-child');
  const last  = q('.toc-shell ol li:last-child, details.toc-shell > ol > li:last-child');
  const c = el => el && getComputedStyle(el);
  return { firstPadLeft: c(first)?.paddingLeft, lastPadLeft: c(last)?.paddingLeft };
})();
Latest grid check:

js
Copy code
(() => {
  const heroImg = document.querySelector('#latest .featured-thumb img');
  const mini = [...document.querySelectorAll('#latest .mini-list > li')];
  return {
    miniCount: mini.length,
    heroAspect: heroImg ? (getComputedStyle(heroImg).aspectRatio || '(n/a)') : '(none)'
  }
})();
At the end, print:

Edited/created files

The exact --page-max set

Any conflicting selectors overridden

Console outputs above