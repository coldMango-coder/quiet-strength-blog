Do not regress Core Web Vitals (LCP/CLS/INP).
Only add CSS or Tailwind classes and minimally tweak JSX. No new render-blocking files. Defer any JS you touch.

Goals (must all pass)

Mobile “Latest Insights” (home):

The featured article image is visually dominant (“bombastic”), not tiny.

Titles are fully readable (no awkward word-by-word wraps).

Cards do not get taller because of forced line breaks.

No layout shift when fonts/images load.

Section width alignment:

The main content container on all pages (home sections and category listing pages) uses the same max width and center alignment as the footer. No left/right bias.

The category grid holder is centered and width-matched to the footer on desktop and mobile.

Table of Contents list numbers:

All ordinal numbers align perfectly (the last item isn’t indented/misaligned on any breakpoint).

Check & fix Tailwind/React/CSS overlaps:

Remove/adjust any local CSS that fights Tailwind utilities (e.g., hard width on inner wrappers, custom padding-left on lists) causing the misalignments/wrap issues.

Inventory & locate files (do this first)

Find shared container & footer

rg -n --iglob '!node_modules' -e 'max-w-(?:screen|[a-z]+)|container mx-auto|site-container|content-container' src | sed -n '1,120p'
rg -n --iglob '!node_modules' -e '<footer|Footer' src


Find Latest Insights (home)

rg -n --iglob '!node_modules' -e 'Latest Insights|latest insights|LatestInsights' src


Find category grid holder

rg -n --iglob '!node_modules' -e 'category(?!-).*grid|Category(Grid|List)|Explore Other Categories' src


Find TOC

rg -n --iglob '!node_modules' -e 'Table of Contents|toc-shell|modern-toc|qs-toc|toc-list' src public


If names differ, use the closest matches; print discovered paths in the log.

Unify the site container width (match footer)

Open the Footer component and capture the wrapper classes (usually something like max-w-7xl mx-auto px-4 sm:px-6 lg:px-8).

Create a reusable class in src/index.css (or global stylesheet already imported once):

/* Shared page container (match footer width & padding) */
.qs-container {
  margin-left: auto;
  margin-right: auto;
  /* Match footer’s max width; if footer uses Tailwind, mirror it here: */
  max-width: var(--qs-maxw, 80rem); /* 1280px ~ max-w-7xl fallback */
  padding-left: clamp(1rem, 2vw, 1.5rem);
  padding-right: clamp(1rem, 2vw, 1.5rem);
  box-sizing: border-box;
}


If your footer uses Tailwind (e.g., max-w-7xl), set the same max on every primary section wrapper via Tailwind or keep the CSS fallback above. Do not add a new blocking CSS file—extend the existing global CSS only.

Wrap or replace section wrappers on:

Home sections (hero follows its own layout; apply to Latest Insights card container)

Category listing page container
with either className="qs-container" or identical Tailwind max-w-7xl mx-auto px-4 sm:px-6 lg:px-8.

Ensure the category grid holder and its “Explore Other Categories” block use the same container wrapper and mx-auto, so the white card aligns perfectly with the footer.

Latest Insights (home) – mobile visual hierarchy

Featured article card (first item only)

On < md, make the image top, full width, 16:9, rounded; text below.

On md+, keep the current layout.

JSX change (example):

// In LatestInsights.jsx (or equivalent)
// For the first/featured card only:
<article className="group rounded-2xl ring-1 ring-black/5 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/70 overflow-hidden">
  {/* Mobile: big top image; desktop: current layout */}
  <div className="md:hidden">
    <img
      src={post.image}
      alt={post.title}
      loading="lazy"
      decoding="async"
      className="w-full aspect-video object-cover"
    />
  </div>
  <div className="p-4 md:p-5">
    <h3 className="text-lg font-semibold leading-snug clamp-2">{post.title}</h3>
    <p className="mt-2 text-sm text-neutral-600 clamp-3">{post.excerpt}</p>
  </div>
</article>


Side list items (other latest posts)

Keep thumbnail ≥ 64px on mobile and ensure titles don’t break every word.

Add a 2-line clamp utility that doesn’t require Tailwind plugin.

Global CSS additions (same file as .qs-container):

/* Multi-line clamping (no plugin required) */
.clamp-2{ display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
.clamp-3{ display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }

/* Prevent hyphen/min-width weird wrapping on long titles */
.no-ugly-wrap{
  word-break: normal;
  overflow-wrap: anywhere; /* allows long words to wrap without letter-by-letter breaks */
  hyphens: auto;
}


Apply to titles/excerpts in the list items:

<h4 className="text-base font-medium leading-snug clamp-2 no-ugly-wrap">{title}</h4>


Images should not cause CLS

Always set an explicit aspect ratio (aspect-square or aspect-[16/9]) and object-cover.

Thumbnails (list): e.g., w-16 h-16 md:w-20 md:h-20 rounded-lg.

Category page card holder – center and match footer width

Ensure the outer wrapper for the card grid uses the same container width as footer:

<section className="qs-container">
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {/* cards */}
  </div>
</section>


Remove any stray CSS that sets fixed width, margin-left, or position: relative; left: Xpx on the grid container.
Search & strip:

rg -n --iglob '!node_modules' -e 'position:\s*relative;.*left|margin-left:\s*\d+px|width:\s*\d+(?:px|vw)' src

TOC number alignment (all items, including the last)

In the TOC stylesheet (or global), enforce consistent list styling without extra left paddings that create a one-off indent:

/* Scope to TOC only to avoid global list changes */
nav.toc, .toc-shell, .modern-toc {
  --toc-indent: 1.25rem; /* 20px */
}
nav.toc ol,
.toc-shell ol,
.modern-toc ol {
  list-style: decimal;
  list-style-position: outside; /* keep bullets outside */
  padding-left: var(--toc-indent);
  margin: 0;
}
nav.toc li,
.toc-shell li,
.modern-toc li{
  margin: 0.25rem 0;
}
/* Kill any special-case first/last overrides from old CSS */
nav.toc li:first-child,
nav.toc li:last-child,
.toc-shell li:first-child,
.toc-shell li:last-child,
.modern-toc li:first-child,
.modern-toc li:last-child {
  padding-left: 0 !important;
  text-indent: 0 !important;
  margin-left: 0 !important;
}


If previous TOC CSS added borders with extra padding on the last item (e.g., .toc li:last-child{ padding-left: .25rem }), remove/override them as above.

Tailwind/React/CSS overlap audit (fix conflicts)

Search for conflicts that cause narrow content and unwanted wrapping:

rg -n --iglob '!node_modules' -e 'max-width:\s*\d|min-width:\s*\d|padding-left:\s*\d|padding-right:\s*\d' src
rg -n --iglob '!node_modules' -e 'w-\[.*\]|ml-\[.*\]|pl-\[.*\]' src


If you find custom CSS setting tight widths on the latest list container (e.g., width: 320px;), remove it and rely on the container + grid/flex with gaps.

If both Tailwind and legacy CSS define the same property, prefer Tailwind and delete/neutralize the custom rule to avoid specificity fights.

Accessibility & SEO niceties (unchanged CWV)

Keep all images: loading="lazy" decoding="async".

Do not add webfonts or heavy scripts.

Ensure headings keep their levels.

Verification checklist

Home (mobile & desktop):

Featured latest: big image on mobile (top, full-width 16:9), title fully readable (2–3 lines max clamp).

Other latest items: thumbnail ≥ 64px, title clamp-2, no micro-wrapping.

No inner scroll bars, no layout shifts.

Category pages: grid centered; same width as footer on desktop; looks centered on mobile.

Any article: TOC numbers align perfectly; last item not indented.

CWV: No new render-blocking, no CLS spikes.

Commit hint

Use a single commit named:

feat(ui): unify container width w/ footer, enlarge mobile featured latest image, clamp titles, fix TOC number