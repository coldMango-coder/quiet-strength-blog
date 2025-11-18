# Modern TOC Block

A Gutenberg block + server-rendered Table of Contents with zero Core Web Vitals regression.

- Server-rendered HTML via PHP (no JS required for bots or users).
- Tiny idle-hydrated JS for scrollspy and smooth scrolling.
- Minimal CSS shipped; integrates with Tailwind if present.

## Installation

1) Copy `wp-content/plugins/modern-toc-block` into your WordPress instance.
2) Activate “Modern TOC Block” in Plugins.
3) Insert the block “Modern Auto TOC” into posts, or use shortcode `[modern_toc]`.

## Settings
- Heading levels: e.g., `2,3,4`
- Sticky offset (px): default 96
- Start collapsed on mobile: default on
- Accent color: CSS color (optional)

## Performance
- CSS scoped and tiny; no external fonts; no layout shifts.
- JS < 6KB (gz), loaded with `type=module` and `defer`, hydrated on `requestIdleCallback`.

## Shortcode
`[modern_toc levels="2,3,4" offset="96" collapsed_mobile="true" accent=""]`

