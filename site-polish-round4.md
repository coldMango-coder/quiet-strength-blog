# Site Polish — Round 4 (mobile images, TOC via details, meta spacing, wider category container & cards, stronger home hero)
**Do not degrade Core Web Vitals (LCP, CLS, INP).**  
- No render-blocking CSS/JS.  
- Prefer CSS; any JS must be idle-hydrated.  
- All images keep explicit width/height or aspect-ratio to prevent CLS.  
- All changes apply to mobile and desktop.

---

## A) Article images on MOBILE are too small → make them full-width & proportional

**Targets:** global content stylesheet (e.g., `src/index.css` or `globals.css`) and your article content wrapper class (replace `.post-content` if different).

Append:

```css
/* ARTICLE MEDIA — modern WP-like */
.post-content img,
.post-content figure > img {
  width: 100% !important;
  height: auto !important;
  display: block;
  object-fit: cover;
  border-radius: 12px;
}

/* Default figure spacing & captions */
.post-content figure { margin: 1.25rem 0; }
.post-content figcaption {
  font-size: .9rem;
  color: rgba(0,0,0,.65);
  text-align: center;
  margin-top: .5rem;
}

/* Ensure content column has breathable padding on small screens */
@media (max-width: 640px) {
  .post-content { padding-left: 1rem; padding-right: 1rem; }
  .post-content img, .post-content figure > img { border-radius: 10px; }
}
If a template forces tiny images (e.g., a fixed width class), remove that class on article images OR wrap them with a max-width: 100% container.

B) Table of Contents → native details/summary (remove “Hide ToC” button)
Goal: just a disclosure triangle like your example. No sticky; no overlay; same look open/closed.

Target: src/components/ModernTOC.(tsx|jsx) — REPLACE the render with this minimalist variant.

tsx
Copy code
import React, { useEffect, useState } from "react";

type H2 = { id: string; text: string; number: string };
const slugify = (s:string)=>(s||"section").toLowerCase().normalize("NFKD")
  .replace(/[^\w\s-]/g,"").trim().replace(/[\s_-]+/g,"-").replace(/^-+|-+$/g,"")||"section";

export default function ModernTOC(){
  const [items,setItems]=useState<H2[]>([]);

  useEffect(()=>{
    const hs = Array.from(document.querySelectorAll("h2")) as HTMLElement[];
    setItems(hs.map((h,i)=>{
      if(!h.id){ let b=slugify(h.textContent||""), id=b, n=2; while(document.getElementById(id)) id=`${b}-${n++}`; h.id=id; }
      return { id:h.id, text:(h.textContent||"").trim(), number:String(i+1) };
    }));
  },[]);

  if(!items.length) return null;

  return (
    <details className="toc-shell block">
      <summary className="toc-title cursor-pointer select-none">
        Table of Contents
      </summary>
      <ol className="toc-list mt-2 space-y-1 text-[0.95rem] leading-6">
        {items.map(h2=>(
          <li key={h2.id}>
            <a className="toc-link" href={`#${h2.id}`} data-active="false">
              {h2.number} {h2.text}
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
CSS (add once, after your variables):

css
Copy code
/* TOC look matches open/closed; no sticky; no overlay */
.toc-shell {
  background: var(--toc-bg);
  color: var(--toc-text);
  border-radius: 1rem;
  border: 1px solid rgba(0,0,0,.05);
  padding: .75rem 1rem;
  margin: 1rem 0;
  position: relative;
  overflow: visible;
}
.toc-title { font-size:.875rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; }
.toc-list { margin:0; padding:0; list-style:decimal; }
.toc-link { display:block; padding:.25rem .5rem; color:var(--toc-link); text-decoration:none; overflow-wrap:anywhere; }
.toc-link:hover { text-decoration:underline; }
.toc-shell a[data-active="true"]{ font-weight:600; border-left:2px solid var(--toc-accent); padding-left:.25rem; color:var(--toc-accent); }
Remove any previous Hide/Show button code and sticky styles for the TOC. No inner scrollbars, no position: sticky.

C) MOBILE meta/byline block has huge blank gaps → tighten spacing
Find the post header meta container (class like .post-meta, .byline, etc.). Add:

css
Copy code
/* META / BYLINE — tighter on small screens */
@media (max-width: 640px){
  .post-meta{
    display:flex; flex-wrap:wrap; align-items:center; gap:.5rem .75rem;
    margin: .5rem 0 1rem 0;       /* reduce big gaps */
    line-height:1.2;
  }
  .post-meta > * { margin:0 !important; }  /* neutralize scattered margins */
}
Make sure meta chips/dots are inline-flex and not adding extra margins.

D) Category/archive pages — container too narrow and cards too small → widen & scale
Targets: category/archive page layout wrapper and the posts grid.

Widen the content container to match footer width:

jsx
Copy code
/* In the Category/Archive page component */
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  {/* header + filters + grid */}
</div>
Grid & card sizing (Tailwind):

jsx
Copy code
<div className="archive-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map(p=>(
    <article key={p.slug} className="post-card h-full flex flex-col rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
      <a href={p.href} className="block mb-3 rounded-xl overflow-hidden">
        <img src={p.image} alt={p.title} loading="lazy" decoding="async"
             className="w-full h-auto aspect-[16/9] object-cover" width="800" height="450" />
      </a>
      <h3 className="text-lg md:text-xl font-semibold leading-snug line-clamp-2">{p.title}</h3>
      <p className="mt-2 text-sm md:text-[15px] text-black/70 line-clamp-3">{p.excerpt}</p>
      <a className="mt-4 text-sm font-medium" href={p.href}>Read More →</a>
    </article>
  ))}
</div>
Fallback CSS (if not Tailwind):

css
Copy code
.archive-grid{ display:grid; grid-template-columns:repeat(1,minmax(0,1fr)); gap:1.5rem; }
@media (min-width:768px){ .archive-grid{ grid-template-columns:repeat(2,minmax(0,1fr)); } }
@media (min-width:1024px){ .archive-grid{ grid-template-columns:repeat(3,minmax(0,1fr)); } }
.post-card{ display:flex; flex-direction:column; height:100%; position:static; }
.post-card img{ width:100%; height:auto; aspect-ratio:16/9; object-fit:cover; display:block; }
Remove any old negative margins or absolute positioning that could cause overlap.

E) “Latest Insights” (home) — make the top article stand out
Turn the list into a grid where the first item is featured (bigger image & title), others in a neat list.

jsx
Copy code
<section id="latest" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    {/* Featured (first post) spans 2 columns on desktop */}
    <article className="lg:col-span-2 rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
      <a href={fp.href} className="block mb-4 rounded-xl overflow-hidden">
        <img src={fp.image} alt={fp.title}
             className="w-full h-auto aspect-[16/9] md:aspect-[21/9] object-cover"
             width="1200" height="600" loading="lazy" decoding="async" />
      </a>
      <h3 className="text-xl md:text-2xl font-bold leading-tight mb-2">{fp.title}</h3>
      <p className="text-[15px] text-black/70 line-clamp-3">{fp.excerpt}</p>
    </article>

    {/* Side list */}
    <ul className="space-y-4">
      {restPosts.slice(0,4).map(p=>(
        <li key={p.slug} className="flex gap-3">
          <a href={p.href} className="shrink-0 block rounded-lg overflow-hidden">
            <img src={p.image} alt={p.title}
                 className="w-[96px] h-[96px] md:w-[110px] md:h-[110px] object-cover rounded-lg"
                 width="110" height="110" loading="lazy" decoding="async" />
          </a>
          <div className="min-w-0">
            <a href={p.href} className="block font-semibold leading-snug line-clamp-2">{p.title}</a>
            <p className="mt-1 text-sm text-black/70 line-clamp-2">{p.excerpt}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
(Use your existing data shape; fp = first post, restPosts = the others.)

F) Verification (Codex must print)
DOM snippet of one article image showing width="…" and full-width in CSS.

TOC markup begins with <details class="toc-shell"> and contains <summary>Table of Contents</summary> — no “Hide ToC” button anywhere.

Category page: container has max-w-7xl, grid display:grid with gap>0, and .post-card positions are static.

Home: latest section shows a lg:col-span-2 featured card with a larger image.

Quick Lighthouse desktop check for one article + the home page; confirm no CLS increase (and ideally improved).