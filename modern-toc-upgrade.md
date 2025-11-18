# Project: Modern, SEO-friendly, Accessible Table of Contents (WordPress + React + Tailwind)

> **NON-NEGOTIABLE:** Do **not** degrade existing **Core Web Vitals** (LCP, CLS, INP). All changes must keep CWV equal or better by: zero layout shift, CSS-first rendering, deferred/idle JS, and zero blocking assets beyond critical CSS.

## Context
The current Table of Contents (TOC) looks dated: flat text hierarchy, no visual rhythm (H2/H3), white container that clashes with the site background, and limited accessibility. We need a modern TOC similar to high-quality examples: clear hierarchy, compact spacing, sticky on desktop, collapsible on mobile, and fully SEO-and a11y-friendly.

The site is WordPress. Implement as a **Gutenberg block** (React) with **server-side fallback** (PHP) and **Tailwind** styling. The block must parse headings from post content (H2–H4), auto-generate anchor links, and render without harming CWV.

---

## Deliverables

1. **New plugin**: `modern-toc-block`
   - Gutenberg block `modern-toc/auto` with React + Tailwind.
   - Server-side renderer in PHP for initial HTML (no JS required to see/scroll).
   - Minimal, tree-shaken JS for progressive enhancements only (scrollspy, smooth scrolling, collapse/expand).
   - Works with existing content (no author action required).

2. **Design**
   - Modern card with subtle tinted background (no pure white), rounded corners, soft shadow.
   - Clear hierarchy:
     - H2 items (level 2) are **semibold**.
     - H3 items indented with left border/marker, normal weight.
     - H4 items further indented, muted text.
   - Active section highlight via scrollspy (intersection observer) with visible left accent bar.
   - Sticky on desktop (top offset customizable); collapsible `<details>` UI on mobile.
   - Dark mode aware via `@media (prefers-color-scheme: dark)` using Tailwind classes.

3. **Accessibility & SEO**
   - Semantic `<nav aria-label="Table of contents">` containing an ordered list.
   - Keyboard tabbable links; skip-link support.
   - Reduced-motion friendly (no forced animations).
   - Heading IDs are deterministic slugs; avoid duplicates.
   - No schema abuse; rely on clean anchors for Google sitelinks.
   - Links include `href="#id"`; **no hashchange hacks** that cause CLS.

4. **Performance constraints (keep or improve CWV)**
   - **Zero CLS**: reserve height for the TOC; avoid async resize.
   - **Small JS** (< 6KB gzipped) loaded with `type="module"` and `defer`, hydrated on `requestIdleCallback`.
   - **Critical CSS** inlined (≤ 2KB) with the rest in the plugin stylesheet, loaded with `media="print"` swap or standard enqueued CSS (no blocking webfonts).
   - No layout reflows on scrollspy; only class toggles.

5. **Settings (Block sidebar)**
   - Heading levels to include (H2–H4 default).
   - “Sticky offset” (px), default 96.
   - “Start collapsed on mobile < 768px” toggle.
   - Accent color (defaults to site primary if available; otherwise Tailwind `indigo`).

6. **QA checklist**
   - ✅ Works with posts lacking H3/H4.
   - ✅ Mobile: collapses into a `<details>` element titled “Table of Contents”.
   - ✅ Desktop: sticky within sidebar; no overlap with header; respects WP admin bar.
   - ✅ Dark & light backgrounds; no white card on tinted pages.
   - ✅ LCP, CLS, INP same or better vs. baseline (measure before/after).
   - ✅ Accessibility: Lighthouse a11y score ≥ 98.

---

## Implementation Plan (create these files)

### 1) Plugin bootstrap
`wp-content/plugins/modern-toc-block/modern-toc-block.php`
- Register block, enqueue assets, provide server-side render callback.
- Add content filter to auto-add IDs to H2–H4 (if missing) using deterministic slugs.

### 2) Server-side renderer
`/includes/render.php`
- Parse the post content for H2–H4.
- Output semantic HTML (see “Target HTML” below) with Tailwind classes.
- Inline a tiny critical CSS block if Tailwind isn’t available at render (safety).

### 3) Block editor code (React)
`/block/src/edit.tsx` & `/block/src/index.tsx`
- InspectorControls for settings above.
- Live preview using the same HTML generator function used on front end.

### 4) Front-end enhancement (tiny JS)
`/assets/toc.ts`
- `requestIdleCallback` (with setTimeout fallback) to:
  - Enhance smooth scrolling with `scrollBehavior: smooth`.
  - Scrollspy via `IntersectionObserver` to toggle `data-active` on links.
  - Persist mobile collapsed state in `sessionStorage` (optional).

### 5) Styling with Tailwind
- Use Tailwind utility classes directly in markup. If Tailwind is already present, reuse it. If not, ship a **minimal CSS** that mimics the needed utilities to avoid bloat.
- Color tokens via CSS variables to inherit site theme:

```css
:root{
  --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #4f46e5) 6%);
  --toc-accent: var(--wp--preset--color--primary, #4f46e5);
  --toc-text: var(--wp--preset--color--foreground, #0b1020);
}
@media (prefers-color-scheme: dark){
  :root{
    --toc-bg: color-mix(in oklab, Canvas, var(--wp--preset--color--primary, #818cf8) 14%);
    --toc-text: var(--wp--preset--color--foreground, #e5e7eb);
  }
}
Target HTML (server-rendered; no JS required)
html
Copy code
<nav class="toc not-prose sticky top-[var(--toc-offset,96px)] max-h-[calc(100vh-120px)] overflow-auto rounded-2xl shadow-sm ring-1 ring-black/5 p-4 md:p-5 bg-[var(--toc-bg)]"
     aria-label="Table of contents">
  <h2 class="text-sm font-semibold tracking-wide uppercase mb-3 text-[var(--toc-text)]">Table of Contents</h2>

  <ol class="space-y-1 text-[0.95rem] leading-6">
    <!-- Level 2 -->
    <!-- Example item -->
    <!--
    <li>
      <a class="block px-2 py-1 rounded hover:underline data-[active=true]:font-semibold data-[active=true]:border-l-2 data-[active=true]:pl-1 data-[active=true]:border-[var(--toc-accent)]"
         href="#intro" data-active="false">1. Introduction</a>
      <ol class="mt-1 ml-4 border-l pl-3 space-y-1">
        <li>
          <a class="block px-2 py-1 text-sm opacity-90 hover:underline"
             href="#intro-scope">Scope</a>
        </li>
      </ol>
    </li>
    -->
  </ol>

  <!-- Mobile collapsible variant (rendered when < md) -->
  <!-- Implemented via <details> wrapper in PHP with summary “Table of Contents” -->
</nav>
Functional Requirements
Parse headings H2–H4 only. Respect their order; produce numbered list (1., 1.1, 1.2 …).

Generate stable slugs (kebab-case, ASCII only). If a duplicate appears, suffix -2, -3, etc.

If post already has IDs, reuse them.

Scrollspy only enhances by toggling data-active="true"; no layout jump.

Smooth scroll uses native CSS (html { scroll-behavior: smooth; }) or element.scrollIntoView({behavior:'smooth'}) with reduced-motion check.

Sticky container applies only on ≥ 1024px. On mobile, wrap in <details> with Tailwind classes md:hidden for the summary header and md:block for desktop.

Provide a shortcode [modern_toc] as an alternative to the block.

Performance Guardrails (enforce programmatically)
Measure baseline and post-deploy via web-vitals in the browser and Lighthouse CI.

Ensure CSS size ≤ 5KB gzipped (incremental over theme).

Ensure JS size ≤ 6KB gzipped; load with defer and hydrate on idle:

js
Copy code
(window.requestIdleCallback||function(cb){setTimeout(cb,1)})(initTOC)
Reserve container height on first paint (no CLS).

No external fonts or icon libraries.

Acceptance Criteria
Visual: modern card, tinted background (not white), clear nested hierarchy with consistent spacing and numbering. Matches the second reference image style conventions.

Usability: keyboard and screen-reader friendly; mobile collapsible; desktop sticky.

SEO: clean anchors; server-rendered HTML; no reliance on JS for bots.

Performance: CWV unchanged or improved compared to baseline (document the diff).

Compatibility: Works with existing posts, themes, and dark/light modes.

Notes for Codex
If Tailwind isn’t present site-wide, scope generated utility classes under .toc and provide tiny CSS equivalents to avoid shipping the full Tailwind runtime.

Keep PHP pure and safe (no short tags). Use WordPress APIs: register_block_type, wp_enqueue_style, wp_enqueue_script, add_filter('the_content', ...).

Namespacing: ModernTOC\* for PHP; modern-toc for assets and handles.

Add a small README with usage and settings.

When complete, output:

the plugin directory tree,

the contents of each file,

installation instructions,

before/after Lighthouse & Web-Vitals numbers, proving no CWV regression.