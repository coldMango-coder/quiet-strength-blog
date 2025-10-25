CODEX TASK — ToC hard isolation & layout repair (no SEO/CWV regressions)
Non-negotiables (must hold or improve)

CWV: LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT ≤ 50ms.

Keep server-HTML canonical, OG/Twitter, JSON-LD (no duplicate Article schemas).

No render-blocking CSS/JS added; any JS runs idle/deferred; no long tasks > 50ms.

Accessibility: WCAG 2.1 AA, focus rings, contrast.

Run FAST pipeline at the end: npm run mini and npm run fast.

1) Render ToC outside .prose and clear the text flow

Why: The article body uses Tailwind Typography (.prose) which injects list/anchor spacing and can cause paragraphs to “flow into” the ToC when the ToC sits inside .prose or next to floats.

Actions

In each blog post template/page (where ToC is rendered), ensure the ToC sits above the article body or in a sidebar as a sibling, not inside the .prose wrapper.

Example (adjust to your layout):

{/* BEFORE (bad): */}
<article className="prose">
  <ArticleTOC items={tocItems} />
  {/* ...article content... */}
</article>

{/* AFTER (good): */}
<section className="not-prose mb-8">
  <ArticleTOC items={tocItems} accent="orange" />
</section>
<article className="prose">
  {/* ...article content... */}
</article>


If you use a 2-col layout, place ToC in the sidebar column (outside .prose). Do not nest ToC within any <p>.

2) ToC component: add hard isolation (+clear both) and stable layout

File: src/components/ArticleTOC.jsx
Update/replace wrapper classes and list/anchor classes exactly as below.

Wrapper (add): qs-toc not-prose relative isolate z-20 clear-both overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-neutral-200

Sticky (desktop): sm:sticky sm:top-24 sm:max-h-[70vh] sm:overflow-y-auto

Toggle button for mobile remains (collapsed by default).

Numbered list and links must be block and wrap normally.

// Top comment: ToC is isolated from .prose; no absolute/flex inline anchors.
import React from "react";

export default function ArticleTOC({ items = [], title="Table of Contents", accent="orange" }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const colorTxt = accent === "blue" ? "text-blue-700" : "text-orange-700";
  const colorBorder = accent === "blue" ? "border-blue-600" : "border-orange-600";

  React.useEffect(() => {
    const start = () => {
      const io = new IntersectionObserver((entries) => {
        const e = entries.find(en => en.isIntersecting);
        if (e?.target?.id) setActive(e.target.id);
      }, { rootMargin: "0px 0px -70% 0px", threshold: [0,1] });
      items.forEach(i => { const el = document.getElementById(i.id); if (el) io.observe(el); });
      return () => io.disconnect();
    };
    if ("requestIdleCallback" in window) requestIdleCallback(start); else setTimeout(start, 0);
  }, [items]);

  const levelPad = (lvl=1) => lvl===1 ? "pl-3 border-l-2" : lvl===2 ? "pl-5 border-l" : "pl-7 border-l";

  return (
    <aside
      className="qs-toc not-prose relative isolate z-20 clear-both overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 sm:sticky sm:top-24 sm:max-h-[70vh] sm:overflow-y-auto"
      aria-label="Table of contents"
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="sm:hidden inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50 focus:outline-none focus-visible:ring"
          aria-controls="toc-panel"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {open ? "Hide" : "Show"}
          <svg className={"ml-2 h-4 w-4 transition-transform " + (open ? "rotate-180" : "")} viewBox="0 0 20 20" fill="currentColor"><path d="M6 8l4 4 4-4"/></svg>
        </button>
      </div>

      <div id="toc-panel" className={"sm:block " + (open ? "block" : "hidden")}>
        <ol className="list-decimal pl-6 pr-4 pb-4 space-y-2">
          {items.map((it, idx) => {
            const isActive = active === it.id;
            return (
              <li key={it.id + ":" + idx} className="marker:font-medium">
                <a
                  href={`#${encodeURIComponent(it.id)}`}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "block whitespace-normal break-words hyphens-none leading-snug hover:underline focus:outline-none focus-visible:ring border-l",
                    levelPad(it.level ?? 1),
                    isActive ? `font-semibold ${colorTxt} ${colorBorder}` : `${colorTxt} border-transparent`
                  ].join(" ")}
                >
                  {it.text}
                </a>
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

3) Scoped resets so no global styles can break ToC

File: src/styles/tailwind.css (or your global CSS). Add under @layer base or plain CSS.

/* ToC isolation: neutralize any inherited prose/utility oddities */
.qs-toc, .qs-toc * {
  /* prevent accidental overlays/flows */
  position: static !important;
  float: none !important;
}

/* Ensure links stack as blocks (no inline/flex from global rules) */
.qs-toc a { display: block !important; }

/* Prevent unwanted margins from .prose on ToC internals */
.prose .qs-toc, .prose .qs-toc * {
  margin: 0 !important;
  padding: 0 !important;
}


These are scoped to .qs-toc only, so they won’t affect the rest of the page. They don’t add blocking CSS and won’t hurt CWV.

4) Finalize the remaining two items (if not already done)

Avatar crop (show full face, zero CLS):
Use object-cover with style={{ objectPosition: '50% 30%' }}, explicit width/height, and a square container (rounded-full, overflow-hidden).

Category tiles (stop broken lines):
Grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6; text whitespace-normal break-words hyphens-none leading-6 text-sm md:text-base; headings text-balance (or h3{ text-wrap: balance; }).

5) Encoding check (diacritics “Š”)

Confirm <meta charset="utf-8"> is the first meta in public/index.html.

Add <meta charSet="utf-8" /> as the first Helmet meta in Seo.

Make sure display strings (e.g., “Marica Šinko”) aren’t passed to slugify; only URLs/slugs use slugify.

No change to canonical/OG/Twitter values beyond charset/meta order.

6) Validate (FAST)
npm run mini
npm run fast


Pass/Visual criteria

ToC no longer overlapped — it’s a clean card; Show/Hide works on mobile; list wraps naturally; colors/indents visible.

Avatar shows full face; category cards read cleanly.

Tab titles and headings render Š correctly (no replacement glyph).

No SEO/schema regressions; CWV unchanged or better.

Return changed files only, with a one-line comment at top of each edited file describing the fix.