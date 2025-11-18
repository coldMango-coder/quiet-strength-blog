# Width Enforcer — make white placeholders full width and fix cramped titles
**Hard rule:** No Core Web Vitals regressions (LCP/CLS/INP). CSS-only wherever possible. No render-blocking.

---

## 0) Quick audit (print so we can verify)
- Print the file paths and component names that render:
  - Home “Latest Insights”
  - Home “Our Core Self-Help Themes”
  - Category pages (archive list), including the wrapper above “Explore Other Categories”
  - Testimonials block on home
- For each of those on the DOM, print the outer container element’s computed `max-width`, `padding-left/right`, and the class list.

---

## 1) Create a single override stylesheet and import it once
**Add:** `src/styles/width-enforcer.css` (or `src/styles/width-enforcer.scss`)

```css
/* --- WIDTH ENFORCER: forces content blocks to match footer width --- */
/* 80rem ~= 1280px (Tailwind's max-w-7xl). Adjust only here if needed. */
:root { --page-max: 80rem; --page-pad-sm: 1rem; --page-pad-md: 1.5rem; --page-pad-lg: 2rem; }

/* Any “container” we have gets widened. Use attribute/role/semantic selectors for safety. */
main > .container, main .container, .container-wide,
.section, section[aria-labelledby], section[id],
.page, .page-wrap, .content-wrap, .content, .wrapper,
.archive-wrap, .archive, .category-wrap, .category,
#latest, .latest, .themes-grid-wrap, .testimonials-wrap {
  max-width: var(--page-max) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: var(--page-pad-sm) !important;
  padding-right: var(--page-pad-sm) !important;
}

@media (min-width: 640px){
  main > .container, main .container, .container-wide,
  .section, section[aria-labelledby], section[id],
  .page, .page-wrap, .content-wrap, .content, .wrapper,
  .archive-wrap, .archive, .category-wrap, .category,
  #latest, .latest, .themes-grid-wrap, .testimonials-wrap {
    padding-left: var(--page-pad-md) !important;
    padding-right: var(--page-pad-md) !important;
  }
}
@media (min-width: 1024px){
  main > .container, main .container, .container-wide,
  .section, section[aria-labelledby], section[id],
  .page, .page-wrap, .content-wrap, .content, .wrapper,
  .archive-wrap, .archive, .category-wrap, .category,
  #latest, .latest, .themes-grid-wrap, .testimonials-wrap {
    padding-left: var(--page-pad-lg) !important;
    padding-right: var(--page-pad-lg) !important;
  }
}

/* Nuke narrow max-width utilities that keep sneaking in (tailwind/legacy) */
[class*="max-w-3xl"], [class*="max-w-4xl"], [class*="max-w-5xl"], [class*="max-w-6xl"] {
  max-width: var(--page-max) !important;
}

/* --- GRIDS --- */
.archive-grid, .themes-grid {
  display: grid !important;
  grid-template-columns: repeat(1, minmax(0,1fr));
  gap: 1.5rem !important;
}
@media (min-width: 768px){
  .archive-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
}
@media (min-width: 1024px){
  .archive-grid, .themes-grid { grid-template-columns: repeat(3, minmax(0,1fr)); }
}

/* Cards are readable and never overlap */
.post-card, .theme-card {
  display: flex; flex-direction: column; height: 100%; position: static;
  border-radius: 1rem; box-shadow: 0 1px 2px rgba(0,0,0,.06);
}
.theme-card { min-height: 300px; }
.post-card h3 { font-size: 1.125rem; line-height: 1.3; }
@media (min-width: 1024px){ .post-card h3 { font-size: 1.25rem; } }

/* Line clamps to stop 6+ line disasters in lists */
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

/* Images always have a safe aspect and fill */
.post-card img, .theme-card img {
  width: 100%; height: auto; aspect-ratio: 16/9; object-fit: cover; display: block;
}

/* --- HOME: Latest Insights layout --- */
#latest .latest-grid { display:grid; grid-template-columns: 1fr; gap: 1.5rem; }
@media (min-width: 1024px){
  #latest .latest-grid { grid-template-columns: minmax(0,2fr) minmax(0,1fr); }
}
#latest .featured-card h3 { font-weight: 800; font-size: 1.25rem; line-height: 1.2; }
@media (min-width: 768px){ #latest .featured-card h3 { font-size: 1.5rem; } }

/* Right column list items */
#latest .mini-list li { display:flex; gap:.75rem; }
#latest .mini-list img { width: 100px; height: 100px; border-radius: .75rem; object-fit: cover; }
#latest .mini-list a.title { font-weight: 600; line-height: 1.25; }

/* Testimonials block shares full width */
.testimonials-wrap { max-width: var(--page-max) !important; }
Import this stylesheet once (no render blocking):

In your main CSS entry, @import "./styles/width-enforcer.css"; or

In the app root (React), <link rel="preload" as="style" href="/styles/width-enforcer.css"><link rel="stylesheet" href="/styles/width-enforcer.css" media="all">

2) Home — Latest Insights markup adjustments (small, safe)
Open the Home “Latest Insights” component and wrap it like this (replace class names you actually use but keep the IDs/classes added below for the CSS to hit):

jsx
Copy code
<section id="latest" className="latest container-wide">
  <div className="latest-grid">
    {/* Featured */}
    <article className="featured-card rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
      <a href={fp.href} className="block mb-4 rounded-xl overflow-hidden">
        <img src={fp.image} alt={fp.title}
             width="1200" height="630"
             className="w-full h-auto aspect-[21/11] md:aspect-[21/9] object-cover"
             loading="lazy" decoding="async" />
      </a>
      <h3 className="mb-2">{fp.title}</h3>
      <p className="text-[15px] text-black/70 line-clamp-3">{fp.excerpt}</p>
    </article>

    {/* Right list */}
    <ul className="mini-list space-y-4 min-w-0">
      {rest.map(p=>(
        <li key={p.slug}>
          <a href={p.href} className="shrink-0 rounded-lg overflow-hidden">
            <img src={p.image} alt={p.title} width="110" height="110" loading="lazy" decoding="async" />
          </a>
          <div className="min-w-0">
            <a href={p.href} className="title block text-[15px] md:text-base line-clamp-2">{p.title}</a>
            <p className="mt-1 text-sm text-black/70 line-clamp-2">{p.excerpt}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
This makes the featured area 2/3 width on desktop and prevents the right list from crushing.

3) Category / Archive page wrapper: enforce wide container
Open the Category page component and ensure the outermost content wrapper uses the wide container:

jsx
Copy code
<div className="container-wide">
  {/* header… */}
  <div className="archive-grid">
    {/* post-card(s) as you already render */}
  </div>
</div>
Remove any smaller max-w-5xl/-6xl wrappers above this grid (replace with container-wide).

4) Home Themes grid: ensure it uses the same wide container
Wrap the section:

jsx
Copy code
<section className="themes-grid-wrap container-wide">
  <div className="themes-grid">
    {/* theme-card(s) as you already render */}
  </div>
</section>
5) Verify & print
For Home Latest container, print computed max-width (should be ~1280px), and grid column template at lg (should be minmax(0,2fr) minmax(0,1fr)).

For Category page archive wrapper, print computed max-width ~1280px, and that .archive-grid has display:grid with gap>0.

For Themes section wrapper, print computed max-width ~1280px.

Screenshot/outerHTML of the right-column list titles showing they’re no longer cramped (two-line clamp).

Lighthouse (desktop) for Home + one Category page: no CLS increase; performance within variance.