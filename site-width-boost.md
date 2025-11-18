# Width & Readability Boost — Home, Themes, Category pages (no CWV regressions)
**Absolute rule:** Do **not** worsen Core Web Vitals (LCP, CLS, INP).  
Only CSS/layout changes; no render-blocking assets. All images must keep explicit dimensions/aspect-ratio.

---

## A) Create a shared wide container that matches footer width
**Files:** your global CSS (e.g., `src/index.css` or `globals.css`).

```css
/* Shared page container matching footer width */
.container-wide{
  margin-left:auto; margin-right:auto;
  max-width: 80rem; /* ≈ Tailwind max-w-7xl (1280px) */
  padding-left: 1rem; padding-right: 1rem;
}
@media (min-width:640px){ .container-wide{ padding-left:1.5rem; padding-right:1.5rem; } }
@media (min-width:1024px){ .container-wide{ padding-left:2rem; padding-right:2rem; } }
If you use Tailwind, you can also use className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" instead of container-wide.

B) HOME — Latest Insights section: make the whole block wider & the featured card bigger
Component: Home “Latest Insights” section.

Wrap the whole section:

jsx
Copy code
<section id="latest" className="container-wide">
Grid with a wide featured column and a readable list column:

jsx
Copy code
<div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
  {/* Featured (first post) */}
  <article className="rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
    <a href={fp.href} className="block mb-4 rounded-xl overflow-hidden">
      <img src={fp.image} alt={fp.title}
           width="1200" height="630"
           className="w-full h-auto aspect-[21/11] md:aspect-[21/9] object-cover"
           loading="lazy" decoding="async" />
    </a>
    <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">{fp.title}</h3>
    <p className="text-[15px] text-black/70 line-clamp-3">{fp.excerpt}</p>
  </article>

  {/* Right column list */}
  <ul className="space-y-4 min-w-0">
    {restPosts.map(p=>(
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
Why this fixes your screenshot: the section now uses the full max-w-7xl width and gives the featured card 2/3 of the space; the list column retains readable widths so titles don’t get cramped.

C) HOME — “Our Core Self-Help Themes” cards: widen container & scale cards
Component: Themes grid on home.

Wrap with wide container:

jsx
Copy code
<section className="container-wide">
  <div className="themes-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {/* cards… */}
  </div>
</section>
Card sizing:

jsx
Copy code
<article className="theme-card h-full min-h-[280px] md:min-h-[320px] flex flex-col rounded-2xl ring-1 ring-black/5 bg-white/90 p-6 shadow-sm">
  <h3 className="text-lg md:text-xl font-semibold leading-snug mb-2">{title}</h3>
  <p className="text-sm md:text-[15px] text-black/70 flex-1">{blurb}</p>
  <a className="mt-4 text-sm font-medium" href={href}>Explore More →</a>
</article>
D) CATEGORY/ARCHIVE pages — widen the white placeholder & keep readable cards
Component: Category/Archive page.

Use the shared wide container:

jsx
Copy code
<div className="container-wide">
  {/* header … */}
  <div className="archive-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {posts.map(p=>(
      <article key={p.slug} className="post-card h-full flex flex-col rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
        <a href={p.href} className="block mb-3 rounded-xl overflow-hidden">
          <img src={p.image} alt={p.title}
               width="800" height="450"
               className="w-full h-auto aspect-[16/9] object-cover"
               loading="lazy" decoding="async" />
        </a>
        <h3 className="text-lg md:text-xl font-semibold leading-snug line-clamp-2">{p.title}</h3>
        <p className="mt-2 text-sm md:text-[15px] text-black/70 line-clamp-3">{p.excerpt}</p>
        <a className="mt-4 text-sm font-medium" href={p.href}>Read More →</a>
      </article>
    ))}
  </div>
</div>
Ensure no old narrow wrappers remain. Remove any parent max-width smaller than 80rem and any negative margins.

E) ARTICLE images on mobile — keep them big
(If not already applied from earlier round.)

css
Copy code
.post-content img, .post-content figure > img{
  width:100% !important; height:auto !important; display:block; object-fit:cover; border-radius:12px;
}
@media (max-width:640px){
  .post-content{ padding-left:1rem; padding-right:1rem; }
  .post-content img, .post-content figure > img{ border-radius:10px; }
}
F) Fallback CSS (if you’re not using Tailwind)
css
Copy code
/* Grids */
.themes-grid, .archive-grid{ display:grid; grid-template-columns:repeat(1,minmax(0,1fr)); gap:1.5rem; }
@media (min-width:640px){ .themes-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1024px){ .themes-grid, .archive-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }

/* Cards */
.theme-card, .post-card{ display:flex; flex-direction:column; height:100%; position:static; }
.post-card img{ width:100%; height:auto; aspect-ratio:16/9; object-fit:cover; display:block; }

/* Line clamps */
.line-clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.line-clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
G) Verification (print these)
Home Latest outer container has max-width: 80rem (or Tailwind max-w-7xl).

Latest grid has grid-template-columns: 2fr 1fr on lg and the featured image has aspect-ratio 21/11–21/9.

Themes section: container reflects container-wide; cards have min-h-[280px] or higher.

Category/Archive: page wrapper is container-wide, grid is 3 columns at lg, titles show unclamped width.

Quick Lighthouse desktop run for home + one category page: CLS unchanged (no new layout shifts); performance within variance.