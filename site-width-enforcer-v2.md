# Width Enforcer v2 — Home width parity + roomy Latest Insights + ToC alignment
**Non-negotiable:** Do **not** degrade Core Web Vitals (LCP/CLS/INP).  
CSS-first; no render-blocking; preserve image width/height or aspect-ratio to prevent CLS.

---

## 1) Global width parity (footer = pages)
**Add / update:** `src/styles/width-enforcer-v2.css` (include even if v1 exists; it extends it)

```css
/* === GLOBAL CONTAINER PARITY === */
:root{
  --page-max: 80rem;            /* ≈ 1280px */
  --page-pad-sm: 1rem;
  --page-pad-md: 1.5rem;
  --page-pad-lg: 2rem;
}

/* Use the same width on key sections (Home + Category + any wrapper) */
.container-wide,
main > .container, main .container,
.section, section[id], .page, .page-wrap,
.content-wrap, .wrapper,
.archive-wrap, .category-wrap,
#latest, .latest, .themes-grid-wrap, .testimonials-wrap {
  max-width: var(--page-max) !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-left: var(--page-pad-sm) !important;
  padding-right: var(--page-pad-sm) !important;
}

@media (min-width:640px){
  .container-wide,
  main > .container, main .container,
  .section, section[id], .page, .page-wrap,
  .content-wrap, .wrapper,
  .archive-wrap, .category-wrap,
  #latest, .latest, .themes-grid-wrap, .testimonials-wrap {
    padding-left: var(--page-pad-md) !important;
    padding-right: var(--page-pad-md) !important;
  }
}
@media (min-width:1024px){
  .container-wide,
  main > .container, main .container,
  .section, section[id], .page, .page-wrap,
  .content-wrap, .wrapper,
  .archive-wrap, .category-wrap,
  #latest, .latest, .themes-grid-wrap, .testimonials-wrap {
    padding-left: var(--page-pad-lg) !important;
    padding-right: var(--page-pad-lg) !important;
  }
}

/* Kill narrower legacy caps */
[class*="max-w-3xl"], [class*="max-w-4xl"], [class*="max-w-5xl"], [class*="max-w-6xl"]{
  max-width: var(--page-max) !important;
}
Import once (non-blocking):

css
Copy code
/* in src/index.css or globals.css */
@import "./styles/width-enforcer-v2.css";
2) HOME — Latest Insights roomy layout
Component: Home “Latest Insights”.

Wrap & grid (Tailwind classes shown; use plain CSS if you don’t have Tailwind):

jsx
Copy code
<section id="latest" className="latest container-wide">
  <div className="latest-grid grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
    {/* Featured (2/3) */}
    <article className="featured-card rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
      <a href={fp.href} className="block mb-4 rounded-xl overflow-hidden">
        <img
          src={fp.image} alt={fp.title}
          width="1200" height="630"
          className="w-full h-auto aspect-[21/11] md:aspect-[21/9] object-cover"
          loading="lazy" decoding="async"
        />
      </a>
      <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">{fp.title}</h3>
      <p className="text-[15px] text-black/70 line-clamp-3">{fp.excerpt}</p>
    </article>

    {/* Right column (1/3) — unclamped width, two-line titles */}
    <ul className="space-y-4 min-w-0">
      {rest.map(p=>(
        <li key={p.slug} className="flex gap-3">
          <a href={p.href} className="shrink-0 rounded-lg overflow-hidden">
            <img src={p.image} alt={p.title}
                 width="110" height="110"
                 className="w-[96px] h-[96px] md:w-[110px] md:h-[110px] object-cover rounded-lg"
                 loading="lazy" decoding="async" />
          </a>
          <div className="min-w-0">
            <a href={p.href} className="block font-semibold leading-snug text-[15px] md:text-base line-clamp-2">
              {p.title}
            </a>
            <p className="mt-1 text-sm text-black/70 line-clamp-2">{p.excerpt}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
If you’re not using Tailwind, add this to width-enforcer-v2.css:

css
Copy code
/* Home latest grid fallback */
.latest-grid{ display:grid; grid-template-columns: 1fr; gap:1.5rem; }
@media (min-width:1024px){ .latest-grid{ grid-template-columns: minmax(0,2fr) minmax(0,1fr); } }
This makes the home white placeholder as wide as the footer and prevents cramped titles.

3) ToC alignment — fix the left shift on the last item
Your ToC uses <details><summary>…</summary><ol>…</ol></details>. Normalize the inner list padding so all items line up (no stray left offset).

Add to a shared CSS file (or keep in width-enforcer-v2.css):

css
Copy code
/* TABLE OF CONTENTS — consistent alignment */
.toc-shell{ border-radius: 1rem; border:1px solid rgba(0,0,0,.08); background:var(--toc-bg); color:var(--toc-text); }
.toc-shell summary{
  list-style: disclosure-closed;
  cursor: pointer;
  font-size:.875rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase;
  padding:.5rem .75rem;
}
.toc-shell[open] summary{ list-style: disclosure-open; }

.toc-shell .toc-list{
  margin: 0;
  padding-left: 1.25rem;      /* ensures numbering column is consistent */
}
.toc-shell .toc-list > li{
  margin: 0; padding: .125rem 0;
}
.toc-shell .toc-link{
  display:block;
  padding: .25rem .5rem;
  text-decoration:none; color:var(--toc-link);
  overflow-wrap:anywhere;
}
.toc-shell a[data-active="true"]{
  font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; color:var(--toc-accent);
}

/* Small screens spacing */
@media (max-width:640px){
  .toc-shell{ margin-left:1rem; margin-right:1rem; }
}
If your ToC container doesn’t have .toc-shell yet, add it to the <details> element (or adjust the selector to whatever you render).

4) Category pages (keep from last round)
Make sure the archive wrapper uses container-wide and your grid is grid-cols-3 at lg. (If already applied, nothing to change.)

5) Verification (Codex must print)
Home: computed max-width for the Latest Insights wrapper equals the footer’s (≈ 1280px).

Home: grid template at desktop is 2fr / 1fr; featured image has aspect-ratio applied.

ToC: <details class="toc-shell"> contains .toc-list with padding-left: 1.25rem and each li has no extra margin-left.

Category: archive wrapper shows the same computed max-width as footer.

Quick Lighthouse desktop check for Home + one Category page; confirm no CLS increase.