CODEX TASK — Final Mobile ToC parity (no CWV regressions)
Non-negotiables

Do not decrease Core Web Vitals. Targets must be kept or improved:

LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT/INP ≤ 50ms.

No SEO regressions: one canonical per page, OG/Twitter intact, JSON-LD intact, no duplicate Article schemas.

No render-blocking resources; any new JS runs on idle; no long tasks > 50ms.

Accessibility: WCAG 2.1 AA (focus rings, ARIA, contrast).

1) Fix mobile overlap and unify layout with desktop

Problem: On mobile, article images overlap the ToC; the ToC sometimes inherits .prose styles or shares flow with floating elements.

Actions

Placement: Ensure ToC renders outside .prose (or in the sidebar column) as a sibling, never inside a <p> or .prose container.

<section className="not-prose mb-6">
  <ArticleTOC items={tocItems} accent="orange" collapsibleMobile />
</section>
<article className="prose">
  {/* article content */}
</article>


Isolation & clearing: ToC wrapper must clear floats and create its own stacking context so article media never overlaps it.

Add classes: relative isolate z-30 clear-both to the ToC wrapper.

Keep sticky only on desktop (sm:sticky sm:top-24). There must be no sticky on mobile.

No inner scroll: Remove any max-h/overflow-y-auto that causes a nested scrollbar. Page scroll should handle long ToCs.

Reserve space: Provide normal block spacing before/after ToC to avoid content kissing: mb-6.

2) ArticleTOC.jsx — final structure & styles

File: src/components/ArticleTOC.jsx (update/replace)

Requirements:

Hierarchy aware: H2 numbered; each H2 shows nested H3 as bullets (same as desktop).

Mobile toggle: collapsed by default on mobile with “Show/Hide” button (aria-controls, aria-expanded, focus styles).

Colors: all links dark orange by default: text-orange-700 hover:text-orange-800 hover:underline; active item font-semibold text-orange-800 border-orange-600.

Isolation: wrapper qs-toc not-prose relative isolate z-30 clear-both rounded-xl bg-white shadow-sm ring-1 ring-neutral-200 sm:sticky sm:top-24.

No inner scroll: remove max-h and overflow-y-auto from the panel.

Block links with normal wrapping: block leading-snug whitespace-normal break-words hyphens-none.

// ArticleTOC.jsx — Mobile/Desktop parity; no inner scroll; dark-orange links.
// Keeps anchors/ids unchanged for SEO; no render-blocking resources.
import React from "react";

function groupByHierarchy(items = []) {
  const out = []; let cur = null;
  items.forEach(it => {
    const lvl = it.level ?? 1;           // 1 = H2, 2 = H3
    if (lvl <= 1) { cur = { ...it, children: [] }; out.push(cur); }
    else if (lvl === 2) { (cur ? cur.children : out).push(it); }
  });
  return out;
}

export default function ArticleTOC({ items = [], title = "Table of Contents", accent = "orange", collapsibleMobile = true }) {
  const [open, setOpen] = React.useState(!collapsibleMobile ? true : false);
  const [active, setActive] = React.useState(null);

  const cTxt = accent === "blue" ? "text-blue-700 hover:text-blue-800" : "text-orange-700 hover:text-orange-800";
  const cActive = accent === "blue" ? "text-blue-800 border-blue-600" : "text-orange-800 border-orange-600";

  React.useEffect(() => {
    const init = () => {
      const io = new IntersectionObserver((entries) => {
        const v = entries.find(e => e.isIntersecting);
        if (v?.target?.id) setActive(v.target.id);
      }, { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] });
      items.forEach(i => { const el = document.getElementById(i.id); if (el) io.observe(el); });
      return () => io.disconnect();
    };
    if ("requestIdleCallback" in window) requestIdleCallback(init); else setTimeout(init, 0);
  }, [items]);

  const grouped = groupByHierarchy(items);

  return (
    <aside
      className="qs-toc not-prose relative isolate z-30 clear-both rounded-xl bg-white shadow-sm ring-1 ring-neutral-200
                 sm:sticky sm:top-24"
      aria-label="Table of contents"
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="sm:hidden inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50
                     focus:outline-none focus-visible:ring"
          aria-controls="toc-panel"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          {open ? "Hide" : "Show"}
          <svg className={"ml-2 h-4 w-4 transition-transform " + (open ? "rotate-180" : "")} viewBox="0 0 20 20" fill="currentColor">
            <path d="M6 8l4 4 4-4" />
          </svg>
        </button>
      </div>

      <div id="toc-panel" className={"sm:block " + (open ? "block" : "hidden")}>
        <ol className="list-decimal pl-6 pr-5 pb-5 space-y-3">
          {grouped.map((h2, i) => {
            const h2Active = active === h2.id;
            return (
              <li key={h2.id || i} className="marker:font-medium">
                <a
                  href={`#${encodeURIComponent(h2.id)}`}
                  aria-current={h2Active ? "true" : undefined}
                  className={[
                    "block leading-snug whitespace-normal break-words hyphens-none border-l-2 pl-3",
                    cTxt, h2Active ? `font-semibold ${cActive}` : "border-transparent"
                  ].join(" ")}
                >
                  {h2.text}
                </a>

                {h2.children?.length > 0 && (
                  <ul className="mt-2 ml-2 list-disc pl-5 space-y-2">
                    {h2.children.map((h3, j) => {
                      const h3Active = active === h3.id;
                      return (
                        <li key={(h3.id || j) + "-sub"}>
                          <a
                            href={`#${encodeURIComponent(h3.id)}`}
                            aria-current={h3Active ? "true" : undefined}
                            className={[
                              "block leading-snug whitespace-normal break-words hyphens-none border-l pl-3",
                              cTxt, h3Active ? `font-semibold ${cActive}` : "border-transparent"
                            ].join(" ")}
                          >
                            {h3.text}
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </aside>
  );
}

3) Scoped CSS resets (mobile safety)

Add to your global CSS (Tailwind @layer base or main CSS):

/* ToC isolation — prevent prose/figure/floats from overlapping on mobile */
.qs-toc, .qs-toc * { position: static !important; float: none !important; }
.qs-toc a { display: block !important; }
.prose .qs-toc, .prose .qs-toc * { margin: 0 !important; padding: 0 !important; }


These are scoped to .qs-toc, so they won’t affect the rest of the site and they don’t create render-blocking CSS. They prevent any floating images or relative/absolute content from overlapping the ToC on small screens.

4) Core Web Vitals protections

CLS: No layout shifts — ToC is normal block; no inner scroll; no sticky on mobile.

LCP/TBT: IntersectionObserver created on idle; no heavy work; no new blocking CSS/JS.

SEO: Anchor ids are unchanged; schema/canonical/OG/Twitter untouched.

5) Validate (FAST)
npm run mini
npm run fast


Pass criteria

Mobile: ToC hidden by default, opens with button; no overlap with images; dark-orange links; H2 with nested H3; page scrolls normally.

Desktop: ToC visible, sticky, no inner scrollbar.

No SEO or JSON-LD changes; CWV not lower than before.