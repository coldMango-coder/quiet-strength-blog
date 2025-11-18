1) Unify container width to footer

Create/ensure a single utility that mirrors the footer container. If footer .container is the source of truth, reuse its max-width:

/* src/styles/width-parity.css (new or append) */
:root{
  --qs-max: 1280px;          /* match footer’s computed max-width */
  --qs-pad-sm: 1rem;
  --qs-pad-md: 1.25rem;
  --qs-pad-lg: 2rem;
}

/* Shared container */
.qs-container{
  max-width: var(--qs-max);
  margin-inline: auto;
  padding-inline: var(--qs-pad-sm);
}
@media (min-width:640px){ .qs-container{ padding-inline: var(--qs-pad-md); } }
@media (min-width:1024px){ .qs-container{ padding-inline: var(--qs-pad-lg); } }

/* Apply parity to known wrappers */
#latest, .latest, .archive-wrap, .category-wrap, main .container-wide{
  max-width: var(--qs-max) !important;
  margin-inline: auto !important;
  padding-inline: var(--qs-pad-sm) !important;
}
@media (min-width:640px){
  #latest, .latest, .archive-wrap, .category-wrap, main .container-wide{
    padding-inline: var(--qs-pad-md) !important;
  }
}
@media (min-width:1024px){
  #latest, .latest, .archive-wrap, .category-wrap, main .container-wide{
    padding-inline: var(--qs-pad-lg) !important;
  }
}

/* Kill legacy caps/offsets that fight Tailwind */
.container,
.archive-wrap,
.category-wrap,
main .container-wide{
  left: auto !important;
  right: auto !important;
}


Apply the class:

Home: wrap the Latest Insights section element with .qs-container (or ensure #latest/.latest exists and is picked up by the selectors above).

Category page root wrapper: add .qs-container (or ensure .category-wrap exists; parity CSS above already targets it).

Post page main content wrapper: ensure it inherits parity width so it matches the footer.

Remove conflicts: Search the project for any of the following within layout wrappers and delete/override them: max-w-3xl, max-w-5xl, inline style="max-width: …", old .container { max-width: 72rem; }, custom margin-left or position hacks. Keep Tailwind utilities as the single source of truth.

2) Mobile Latest Insights: big featured image + readable titles

CSS (append to width-parity.css or the component stylesheet):

/* Featured card image must be visually dominant on mobile */
#latest .featured-card{
  display: block;
  border-radius: 1rem;
  background: #fff;
}
#latest .featured-card img{
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 16/9;              /* CLS-safe hero */
  object-fit: cover;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
}
@media (max-width: 639.98px){
  #latest .featured-card h3{ font-size: 1.5rem; line-height: 1.2; }
}

/* Right list readability (6 items, single-line titles) */
#latest .mini-list li{ display: grid; grid-template-columns: 104px 1fr; gap: .75rem; }
#latest .mini-list img{ width: 104px; height: 104px; object-fit: cover; border-radius: .75rem; }
#latest .mini-list h4{
  font-size: .95rem; line-height: 1.25rem;
  display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden;
}
#latest .mini-list p{
  color: #6b7280;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}


React (Latest block component):

Ensure the first article renders as .featured-card with the image above the title on mobile.

Ensure the right list is capped at 6 items.

Provide explicit width/height on images (or sizes + aspect-ratio) to keep CLS stable.

Keep the desktop 2fr/1fr grid; only change mobile layout (image on top).

3) Category listing holder centered under footer width

Wrap the category grid outer with .qs-container (or ensure .category-wrap exists; parity CSS centers it).

Remove any narrow cap on the category intro/blurb that makes the grid look off compared to the footer.

Verify the white card area visually aligns exactly with the footer width on desktop and mobile.

4) Table of Contents numeric alignment (including last item)
/* ToC alignment */
.toc-shell .toc-list{
  padding-left: 1.25rem;
  margin: 0;
  list-style-type: decimal;
  list-style-position: outside;          /* markers align in one column */
  font-variant-numeric: tabular-nums;
}
.toc-shell .toc-list > li{
  margin: 0;
  padding: .125rem 0;
  text-indent: 0;
}


Remove any custom margin-left on the first or last list item.

Ensure the final item has no extra indent—all numbers share the same vertical column.

5) Conflict audit (Tailwind vs legacy)

Search and neutralize any CSS that overrides layout widths/padding for these selectors:

#latest, .latest, .archive-wrap, .category-wrap, .container-wide, main .container-wide.
Delete/override: fixed widths, max-width caps smaller than the footer, negative margins, positional nudges.

6) Safety checks (no CWV hits)

Don’t add blocking <link rel="stylesheet">—use existing pipeline or appended CSS in the main bundle.

Keep all images loading="lazy" / decoding="async" (except the top LCP image if your framework handles it).

All layout changes are CSS + className updates only.

7) Quick acceptance checklist (visual)

Home (mobile): Featured image is full-width 16:9 above the title and looks big; title ≥ 1.5rem; list shows exactly 6 items with single-line titles.

Home/Category/Post (desktop): Main content width equals footer width; centered.

Category page: White grid holder centered, not left-shifted.

Any post: ToC numbers (1…N) align in one straight vertical column; last number not shifted.