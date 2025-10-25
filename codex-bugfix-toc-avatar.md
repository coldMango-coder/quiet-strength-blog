CODEx TASK — Fix residual UX bugs (ToC, encoding, avatar, categories)

Do not regress SEO, prerender, or Core Web Vitals.

Non-negotiables (keep as-is or improve)

CWV targets: LCP ≤ 1.8s (mobile), CLS ≤ 0.05, TBT ≤ 50ms.

Keep one canonical per page; OG/Twitter/JSON-LD unchanged; no duplicate Article schemas.

Don’t add render-blocking CSS/JS. All new JS must be deferred/idle and no single long task > 50ms.

Keep existing sitemap, robots, caching headers, link normalization.

Accessibility WCAG 2.1 AA must remain (focus styles, contrast, semantics).

Run FAST pipeline to validate (Chromium-only PW + quick SEO check).

0) Encoding/Mojibake still visible (tab title / “Š” → �)

Goal: Never show replacement glyphs in titles/meta again.

Actions

Ensure <meta charset="utf-8"> is literally the first <meta> in the head of the prerendered HTML.

In public/index.html, make sure:

<meta charset="utf-8" />


is the first meta element. Do not duplicate; ensure order only.

In src/components/Seo.js (or wherever Helmet is used):

Add <meta charSet="utf-8" /> at the top of the Helmet block.

Pass display strings through sanitizeText() (keep diacritics), but never slugify titles/names.

Confirm title/og:title/twitter:title use the display value (with diacritics).

Headers: in vercel.json, ensure HTML responses declare charset:

{
  "headers":[
    {
      "source": "/(.*)",
      "headers":[
        { "key":"Content-Type","value":"text/html; charset=utf-8" }
      ]
    }
  ]
}


If this exists already, do not duplicate—only add if missing.

Fonts: ensure the default font stack includes a Latin-Extended fallback:

:root { font-family: "Inter var", Inter, system-ui, -apple-system, "Segoe UI", Roboto, "Noto Sans", "Liberation Sans", Arial, "Helvetica Neue", "Segoe UI Emoji", "Noto Color Emoji", sans-serif; }


Acceptance

The browser tab shows “Marica Šinko” correctly (no �).

View Source shows the charset meta first in the head.

Quick SEO validator passes; no schema or OG/Twitter changes except safe charSet/meta order.

1) Table of Contents: add close/collapse button, fix wrapping/levels/colors, prevent “deranged” stacking on mobile

Goal: Professional, compact ToC with toggle, sticky on desktop, stable wrapping, colored levels.

Create/Update: src/components/ArticleTOC.jsx

Requirements

Props: items: {id, text, level?:1|2|3}[], title="Table of Contents", accent='orange'|'blue' (default orange).

Desktop: sticky top-24, max-h-[70vh], overflow-y-auto, internal scrolling, z-10.

Mobile: collapsed by default; a Tailwind button toggles (no libs).

Button: rounded, subtle shadow, icon “chevron” rotation; aria-controls, aria-expanded.

Layout:

H1/H2/H3 visual hierarchy via left border + indent:

level 1: pl-3 border-l-2

level 2: pl-5 border-l

level 3: pl-7 border-l

Colors (accent orange):

text: text-orange-700 (hover underline)

active item (via IntersectionObserver): aria-current="true", font-semibold, border-orange-600

Text stability / no weird splits:

Items are block links: block leading-snug whitespace-normal break-words break-normal hyphens-none tracking-normal

Prevent multi-line number collision: list-decimal pl-6 on an outer <ol>.

On mobile: single-line clamp if needed: sm:line-clamp-none line-clamp-1 (only if your headings are extremely long).

Performance:

Use a tiny IntersectionObserver initialized with requestIdleCallback fallback.

No reflows: only toggle class names.

No resize observers.

Skeleton (key parts only)

function ArticleTOC({ items=[], title="Table of Contents", accent="orange" }) {
  const [open, setOpen] = React.useState(false);
  const [active, setActive] = React.useState(null);
  const color = accent === "blue" ? "text-blue-700 border-blue-600" : "text-orange-700 border-orange-600";

  React.useEffect(() => {
    const run = () => {
      const observer = new IntersectionObserver((entries) => {
        const vis = entries.find(e => e.isIntersecting);
        if (vis?.target?.id) setActive(vis.target.id);
      }, { rootMargin: "0px 0px -70% 0px", threshold: [0, 1] });
      items.forEach(i => {
        const el = document.getElementById(i.id);
        if (el) observer.observe(el);
      });
      return () => observer.disconnect();
    };
    if ("requestIdleCallback" in window) { requestIdleCallback(run); } else { setTimeout(run, 0); }
  }, [items]);

  return (
    <aside className="rounded-xl bg-white shadow-sm border border-neutral-200">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button
          className="sm:hidden inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-neutral-50 focus:outline-none focus-visible:ring"
          aria-controls="toc-panel"
          aria-expanded={open}
          onClick={() => setOpen(v=>!v)}
        >
          {open ? "Hide" : "Show"}
          <svg className={"ml-2 h-4 w-4 transition-transform " + (open ? "rotate-180" : "")} viewBox="0 0 20 20" fill="currentColor"><path d="M6 8l4 4 4-4"/></svg>
        </button>
      </div>
      <div id="toc-panel" className={"sm:block " + (open ? "block" : "hidden")}>
        <ol className="list-decimal pl-6 pr-4 pb-4 space-y-2 max-h-[70vh] overflow-y-auto sticky:top-24">
          {items.map((it, idx) => {
            const level = it.level ?? 1;
            const pad = level===1 ? "pl-3 border-l-2" : level===2 ? "pl-5 border-l" : "pl-7 border-l";
            const isActive = active === it.id;
            return (
              <li key={it.id+idx}>
                <a
                  href={`#${encodeURIComponent(it.id)}`}
                  aria-current={isActive ? "true" : undefined}
                  className={[
                    "block whitespace-normal break-words break-normal hyphens-none leading-snug hover:underline focus:outline-none focus-visible:ring",
                    pad,
                    isActive ? `font-semibold ${color}` : color
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
export default ArticleTOC;


Acceptance

Mobile shows a Show/Hide button; desktop is sticky.

No overlapping/smashed lines; long items wrap cleanly.

Levels/indentation + accent color applied.

PW Chromium test + quick SEO pass.

2) Author avatar still cuts off face

Goal: Show full face with tasteful crop; zero CLS.

Update: src/components/Avatar.jsx and ensure AuthorBio.jsx uses it.

Rules

Container: aspect-square w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow

Image: object-cover [object-position:50%_30%] (bias upward); allow override via prop.

Attributes: explicit width/height to prevent CLS; loading="lazy" when not LCP.

Snippet

export default function Avatar({ src, alt, size = 112, focal = "50% 30%" }) {
  const s = { width: size, height: size, };
  return (
    <div className="rounded-full overflow-hidden border-4 border-white shadow" style={{ ...s }}>
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ objectPosition: focal }}
      />
    </div>
  );
}


Acceptance

Avatar shows whole face (top bias), no reflow.

3) Category tiles: text breaks into awkward chunks

Goal: Stable, readable tiles with better columns.

Update: Category grid container and card text classes.

Grid: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6

Column safety: each card min-w-[260px] at sm, min-w-[280px] at lg.

Text: whitespace-normal break-words break-normal hyphens-none leading-6 text-sm md:text-base

Headings: text-balance (Tailwind plugin or CSS), tracking-normal

Acceptance

No vertical letter stacking; headings don’t hyphenate; readable at all widths.

4) ToC text “deranged” on mobile (overlaying lines)

Cause: Numbered list/links inline or absolutely positioned + no wrapping.
Fix: Ensure block anchors, internal padding for the list marker, and overflow confined.

Ensure ToC list uses <ol class="list-decimal pl-6 space-y-2">.

Links: block, not inline; remove any absolute positioning from ToC item wrappers.

Container: max-h-[60vh] overflow-y-auto on mobile open state.

Prevent interference from global styles: add a scoped wrapper class .qs-toc if needed; reset any display:flex that forces cramped columns.

5) Core Web Vitals protections (no regressions)

CLS: all images/avatars get width/height or aspect-*; ToC has fixed container and avoids layout thrash.

LCP: no new blocking resources; ToC JS loads after idle; Avatar lazy when non-LCP.

TBT/INP: intersection logic defers via requestIdleCallback; no heavy observers.

SEO: anchors unchanged (ids stable), no extra canonicals/schemas.

Tests to run (FAST)
npm run mini            # quick build + static SEO
npm run fast            # build + unit tests + PW (Chromium) + quick SEO
# (optional) FULL=1 npm run full


Pass criteria

FAST: ✅

Visual: ToC toggle/button on mobile, correct wrapping/colors/indent levels; avatar shows full face; category tiles clean; titles render diacritics correctly.

No change to canonical/JSON-LD counts/values (aside from safe charSet placement).

Return only changed files with brief comments at the top of each edited file explaining the fix (1–2 lines).