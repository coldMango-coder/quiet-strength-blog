# Latest Insights — PRO layout (width parity, readable titles, short list)
**Hard rule:** Do NOT degrade Core Web Vitals (LCP/CLS/INP).  
CSS-first; keep image dimensions/aspect-ratio to prevent CLS; no render-blocking.

---

## 0) Quick scan (print what you find)
1) Print the file(s) that render the Home **Latest Insights** section (component + CSS).  
2) Print any global/util CSS that touches:
   - `.latest`, `#latest`, `.latest-grid`, `.container`, `.max-w-*` utilities, `.mini-list`, `.featured-card`.  
3) Print all occurrences of `max-w-3xl`, `max-w-4xl`, `max-w-5xl`, `max-w-6xl`, and **any** hard-coded `width:` on wrappers.  
4) Print how many posts are currently rendered in the right column list.

*(We’ll remove/override anything that narrows the container or overflows titles.)*

---

## 1) Global parity (footer = page width)
**Create/Update:** `src/styles/width-parity.css` and import once (non-blocking).

```css
:root{
  --page-max: 80rem;           /* ~1280px, footer width */
  --pad-sm: 1rem; --pad-md: 1.5rem; --pad-lg: 2rem;
}

/* Shared container width used by Home + Category */
.container-wide,
#latest, .latest,
.archive-wrap, .category-wrap {
  max-width: var(--page-max) !important;
  margin-inline: auto !important;
  padding-inline: var(--pad-sm) !important;
}
@media (min-width:640px){ .container-wide, #latest, .latest, .archive-wrap, .category-wrap { padding-inline: var(--pad-md) !important; } }
@media (min-width:1024px){ .container-wide, #latest, .latest, .archive-wrap, .category-wrap { padding-inline: var(--pad-lg) !important; } }

/* Kill narrower cap utilities that keep sneaking in */
[class*="max-w-3xl"], [class*="max-w-4xl"], [class*="max-w-5xl"], [class*="max-w-6xl"] {
  max-width: var(--page-max) !important;
}

/* Reset any old floats/overflow that cramp lists */
#latest * { float:none !important; }
Import once (no blocking):

css
Copy code
/* src/index.css or globals.css */
@import "./styles/width-parity.css";
2) Latest Insights — compact, professional, SEO-friendly layout
Update the Home component that renders Latest Insights to use this exact structure.
If you don’t use Tailwind, also add the plain-CSS fallback below.

jsx
Copy code
<section id="latest" className="latest container-wide">
  <header className="flex items-center justify-between mb-3">
    <h2 className="text-xl md:text-2xl font-bold">Latest Insights</h2>
    <a className="text-sm font-medium opacity-80 hover:opacity-100" href="/blog">View All →</a>
  </header>

  <div className="latest-grid grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
    {/* Featured card (2/3 width on desktop, full on mobile) */}
    <article className="featured-card rounded-2xl ring-1 ring-black/5 bg-white p-5 shadow-sm">
      <a href={featured.href} className="block mb-4 rounded-xl overflow-hidden">
        <img
          src={featured.image} alt={featured.title}
          width="1200" height="630"
          className="w-full h-auto aspect-[16/9] md:aspect-[21/9] object-cover"
          loading="lazy" decoding="async"
        />
      </a>
      <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-2">
        {featured.title}
      </h3>
      <p className="text-[15px] md:text-base text-black/70 line-clamp-3">{featured.excerpt}</p>
    </article>

    {/* Right column list (limit to 6 posts, titles readable) */}
    <ul className="mini-list space-y-4 min-w-0">
      {posts.slice(0, 6).map(p => (
        <li key={p.slug} className="flex gap-3 items-start">
          <a href={p.href} className="shrink-0 rounded-lg overflow-hidden">
            <img
              src={p.image} alt={p.title}
              width="110" height="110"
              className="w-[104px] h-[104px] md:w-[110px] md:h-[110px] object-cover rounded-lg"
              loading="lazy" decoding="async"
            />
          </a>
          <div className="min-w-0">
            <a href={p.href} className="block font-semibold leading-snug text-base md:text-[17px] one-line">
              {p.title}
            </a>
            <p className="mt-1 text-sm text-black/70 two-lines">{p.excerpt}</p>
          </div>
        </li>
      ))}
    </ul>
  </div>
</section>
Plain CSS fallback (add to width-parity.css if you don’t use Tailwind):

css
Copy code
/* grid */
.latest-grid{ display:grid; grid-template-columns:1fr; gap:1.5rem; }
@media (min-width:1024px){ .latest-grid{ grid-template-columns:minmax(0,2fr) minmax(0,1fr); } }

/* line clamps for titles/excerpts (readable, not cramped) */
.one-line{
  display:-webkit-box; -webkit-line-clamp:1; -webkit-box-orient:vertical; overflow:hidden;
}
.two-lines{
  display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;
}

/* Featured title scale mobile vs desktop */
@media (max-width:639.98px){
  .featured-card h3{ font-size:1.375rem; line-height:1.2; }
}

/* Image aspect safety (prevents CLS) */
.featured-card img{ aspect-ratio: 16/9; object-fit: cover; }
.mini-list img{ aspect-ratio: 1/1; object-fit: cover; }
Why this fixes what you see

The right list is capped to 6 items → section isn’t endlessly tall.

Titles in the list use a single visible line with ellipsis (.one-line) → no cramped multi-row wrapping.

The featured card has a large image and headline (mobile & desktop scales) → “bombastic” hero look.

3) Mobile polish (featured image + spacing)
Keep featured image at 16:9 on mobile (already set) and increase the headline to 1.375–1.5rem.

Ensure .mini-list thumbnails stay ~100–110px square so they don’t squeeze the text.

(All in the CSS above.)

4) Category pages: width parity with footer
Keep the wrapper class container-wide or .archive-wrap on Category pages; parity CSS from step 1 enforces same width as footer.

5) Table of Contents: tiny alignment fix
If any ToC item still shifts, normalize the ordered list padding:

css
Copy code
/* ToC alignment */
.toc-shell .toc-list { padding-left: 1.25rem; margin: 0; }
.toc-shell .toc-list > li { padding: .125rem 0; margin:0; }
6) Remove conflicts (clean-up)
Delete or comment any old CSS rules narrowing containers for:

#latest, .latest, .container, .post-list, .mini-list, .featured-card.

If multiple home/landing styles exist, keep only the ones imported above.

If an older component also renders “Latest Insights”, export only one and remove duplicates.

(Print the removed rules so the diff shows exactly what changed.)

7) Verification (Codex must show)
Computed max-width for #latest equals footer (≈ 1280px).

Desktop grid template = 2fr / 1fr.

Right column shows 6 items max; each title is one line (check -webkit-line-clamp:1).

Mobile: featured title ≥ 1.375rem; image aspect 16:9; list thumbnails ~100–110px.

Lighthouse desktop spot-check for Home + one Category page: no CLS increase (images have width/height or aspect-ratio), performance within variance.


Apply latest-insights-pro.md exactly and keep ALL Core Web Vitals equal or better.

Additionally AUDIT + FIX conflicts:
1) Check for overlapping React components:
   - Ensure only ONE "Latest Insights" component renders on Home.
   - Search for duplicate/legacy components or conditional renders of Latest Insights, PostList, HeroLatest, or similar. Remove/disable extras.
   - Verify no nested providers/styles re-wrap the latest section.

2) Tailwind conflicts audit:
   - Print tailwind.config.{js,ts} and confirm content paths include all src/** files; fix if missing.
   - Check for custom container/maxWidth/theme overrides that cap width < 80rem. Remove/override those for Home/Category.
   - Print @layer base/components/utilities rules touching: #latest, .latest, .container, .mini-list, .featured-card, .toc-shell. Remove/override any narrowing/float/overflow that fight the new layout.
   - If @tailwind base preflight or typography plugin resets change heading sizes/line-heights in Latest, add local overrides only inside #latest.

3) Verify no CSS module or styled-component narrows wrappers. Search for width/max-width/float on:
   #latest, .latest-grid, .mini-list, .featured-card, .archive-wrap, .category-wrap, .container.
   Remove or override to match width-parity.css.

4) Re-run validation:
   - Home #latest computed max-width == footer (~1280px).
   - Desktop grid template is 2fr/1fr.
   - Right list capped at 6 items; titles one-line, excerpts two-lines; thumbnails ~100–110px.
   - Mobile featured image 16:9 and larger; headline ≥ 1.375rem.
   - Category wrapper width equals footer.
   - ToC ol padding aligns numbers; no left-shift on last item.

5) Print diffs + DOM/computed-style snapshots + the list of removed conflicting rules.