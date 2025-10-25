CODEX FOLLOW-UP — Repair ToC distortion + finalize avatar, categories, encoding

Do not regress Core Web Vitals, prerender, or SEO.
Targets preserved: LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT ≤ 50ms.
No duplicate Article schemas; 1 canonical per page; OG/Twitter/JSON-LD untouched.

0) Root cause guardrails

The ToC sits next to article content that uses Tailwind Typography (prose). The ToC must not inherit .prose styles.

The ToC must not use absolute/inline links or any global list overrides.

All ToC items must be block elements with normal wrapping — no overlay, no stacking.

1) Patch ArticleTOC to be “style-isolated” and stable

File: src/components/ArticleTOC.jsx (replace if needed)

Requirements

Wrap with a style isolation class and reset: not-prose relative isolate bg-white.

Container: rounded-xl shadow-sm ring-1 ring-neutral-200, z-10, no position: absolute.

Desktop: sticky top-24 max-h-[70vh] overflow-y-auto.

Mobile: collapsed by default with a Tailwind button; no libraries.

Numbered list rendered with <ol class="list-decimal pl-6 space-y-2">.

Every item is a block link (no inline): block leading-snug whitespace-normal break-words hyphens-none.

Hierarchy/indents by level (1/2/3), accent color (orange default, blue optional).

Active item via IntersectionObserver on idle; add aria-current="true".

Implementation (key parts)
// Top-of-file comment: Isolated ToC; avoids .prose and global list/anchor overrides.
import React from "react";

export default function ArticleTOC({ items = [], title="Table of Contents", accent="orange" }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const colorTxt = accent === "blue" ? "text-blue-700" : "text-orange-700";
  const colorBorder = accent === "blue" ? "border-blue-600" : "border-orange-600";

  React.useEffect(() => {
    const init = () => {
      const io = new IntersectionObserver(
        (entries) => {
          const e = entries.find(en => en.isIntersecting);
          if (e?.target?.id) setActive(e.target.id);
        },
        { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] }
      );
      items.forEach(i => {
        const el = document.getElementById(i.id);
        if (el) io.observe(el);
      });
      return () => io.disconnect();
    };
    if ("requestIdleCallback" in window) requestIdleCallback(init);
    else setTimeout(init, 0);
  }, [items]);

  return (
    <aside
      className="not-prose relative isolate rounded-xl bg-white shadow-sm ring-1 ring-neutral-200"
      aria-label="Table of contents"
    >
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold"> {title} </h2>
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
        <ol className="list-decimal pl-6 pr-4 pb-4 space-y-2 sm:max-h-[70vh] sm:overflow-y-auto">
          {items.map((it, idx) => {
            const level = it.level ?? 1;
            const pad = level===1 ? "pl-3 border-l-2" : level===2 ? "pl-5 border-l" : "pl-7 border-l";
            const isActive = active === it.id;
            return (
              <li key={it.id + ":" + idx} className="marker:font-medium">
                <a
                  href={`#${encodeURIComponent(it.id)}`}
                  className={[
                    "block whitespace-normal break-words hyphens-none leading-snug hover:underline focus:outline-none focus-visible:ring",
                    pad,
                    colorTxt,
                    isActive ? `font-semibold ${colorBorder}` : "border-transparent",
                    "border-l"
                  ].join(" ")}
                  aria-current={isActive ? "true" : undefined}
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

CSS/utility safeguards

Add the following small reset to your global CSS (or Tailwind @layer base):

/* ToC isolation: avoid global .prose and anchor/list overrides bleeding in */
.qs-toc *, .not-prose .qs-toc * {
  position: static !important;
}

/* If any global styles make anchors inline or flex, force block in ToC */
.qs-toc a { display: block !important; }


Apply className="qs-toc" to the outer <aside> if you need the extra reset. Prefer using not-prose first.

Acceptance

On mobile, the list is inside the ToC card (no article text bleeding through).

No overlapping/stacking; long lines wrap normally.

Show/Hide button works; desktop remains sticky.

2) Ensure the ToC container is not rendered inside a paragraph

If ToC is inserted by Markdown/MDX, ensure it’s rendered as its own block element (e.g., <ArticleTOC /> inside a <section>), not inside a <p>. Audit the renderer that auto-extracts headings; fix any unsafe JSX insertion that could nest ToC in <p> tags.

Acceptance

DevTools shows ToC <aside> is a top-level sibling within the article container, not a child of <p>.

3) Encoding: fix remaining “�” in tab titles

Confirm <meta charset="utf-8"> is first meta in public/index.html.

In Seo component, add <meta charSet="utf-8" /> at the top of Helmet block.

Make sure display strings (e.g., “Marica Šinko”) are not run through slugify; only URLs use slugify.

4) Avatar: show full face, zero CLS

File: src/components/Avatar.jsx

Container: aspect-square w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow.

Image: width+height props set to container px; class="w-full h-full object-cover"; style={{ objectPosition: '50% 30%' }}; loading="lazy" when non-LCP.

Update AuthorBio.jsx to use the Avatar’s size prop so it matches the intrinsic dimensions.

5) Category tiles: prevent weird broken lines

Grid wrapper: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6.

Card min widths: sm:min-w-[260px] lg:min-w-[280px].

Text: whitespace-normal break-words break-normal hyphens-none leading-6 text-sm md:text-base.

Headings: add text-balance (or custom CSS: h3{ text-wrap: balance; }).

6) Tests (FAST only)
npm run mini
npm run fast
# optional later: FULL=1 npm run full


Pass criteria

FAST passes.

Visual: ToC is not distorted on mobile/desktop; button present; color/indent levels correct.

Avatar shows full face; categories no longer split awkwardly.

Titles/head content show proper diacritics.

Important: Do not modify canonical/OG/Twitter/JSON-LD logic or counts; no new blocking CSS/JS; no long tasks > 50ms.

Return only changed files with 1–2 line comments explaining each fix.

If anything still looks off after this, send me a fresh screenshot and I’ll tighten the reset even more (e.g., force list-style + display:block under a .qs-toc scope, or neutralize any rogue global position:absolute rules).