## SEO + Performance Remediation
1) Canonical, host, and sitemaps (fix the “localhost” + duplication)

Decision: Use https://trueallyguide.com
 as the one canonical host (no www).

Required changes

In the global HTML head template (your layout file), replace any existing canonical with:

<link rel="canonical" href="https://trueallyguide.com{{ pathname }}" />


{{ pathname }} must be the current path (e.g., /blog/..., /category/..., /).

Remove any rel="canonical" pointing to http://localhost:* or www.*.

Redirect rules (single hop, permanent):

http://trueallyguide.com/* → https://trueallyguide.com/:splat (301)

http://www.trueallyguide.com/* → https://trueallyguide.com/:splat (301)

https://www.trueallyguide.com/* → https://trueallyguide.com/:splat (301)

(Use your platform syntax — e.g., Netlify _redirects, Vercel rewrites/redirects, Nginx server blocks; one 301 hop only.)

Sitemaps:

Publish one sitemap index at https://trueallyguide.com/sitemap.xml.

Remove/stop serving https://www.trueallyguide.com/sitemap.xml.

In robots.txt, include one line:

Sitemap: https://trueallyguide.com/sitemap.xml


Remove any entries from the sitemap that currently resolve with a redirect (Search Console “Page with redirect”). Sitemaps should list final URLs only.

2) Meta robots on error pages (fix “noindex/nofollow newsletter”)

If /newsletter is a real landing page, publish it and use:

<meta name="robots" content="index,follow,max-snippet:-1,max-image-preview:large,max-video-preview:-1">


If /newsletter is intentionally not used, remove all internal links to it and keep it 404 with:

<meta name="robots" content="noindex,follow">


Do not use nofollow sitewide. Only use nofollow on truly untrusted external links (none in the current report require it).

3) Titles & meta descriptions (fix “too long” + “multiple meta description tags”)

Rules

Exactly one <title> and one <meta name="description"> per document.

Title target: ≤ 60–65 chars (pixel-safe).

Description target: 150–160 chars max.

Shorten these titles (keep keywords, drop year/extras at end):

How to Know if You Deserve Better ... | Quiet Strength
→ Do You Deserve Better? 7 Clear Signs for Introvert Women

How to Stop Attracting Narcissists ... | Quiet Strength
→ How to Stop Attracting Narcissists: 9 Proven Strategies

How to Be Confident as an Introvert Woman ...
→ How to Be Confident as an Introvert Woman

How to Speak Up in Meetings ...
→ How to Speak Up in Meetings as an Introvert

Introvert Social Battery Drained ...
→ Introvert Social Battery Drained? 9 Ways to Recharge

Morning Routine for Confidence and Productivity ...
→ Morning Routine for Confidence and Productivity

Post Breakup Glow Up ...
→ Post-Breakup Glow Up: 10 Steps

(You can keep “Quiet Strength” globally via a layout suffix if it doesn’t push beyond ~60–65 chars.)

Trim long descriptions (examples; keep meaning, reduce length):

Relationships & Dating category:
→ Explore articles on relationships and dating with confidence—boundaries, healthy communication, and intentional choices for introverted women.

Career & Workplace category:
→ Advance your career without burnout. Practical advice for introverted women on boundaries, focus, and sustainable success.

Introversion & Personality category:
→ Insights on introversion and personality types with practical ways to leverage your strengths as an introverted woman.

Articles with overly long meta—cut to ≤160 chars while retaining primary keyword.

Implementation

Ensure your layout renders one description tag. Remove any component-level duplicates.

Where a page supplies description, render the page value; otherwise fall back to a site default.

4) Category slugs & redirect chains (fix %26 “&”)

Normalize slugs to hyphenated English words:

/category/introversion-and-personality

/category/relationships-and-dating

/category/career-and-workplace

/category/self-development

301 redirect from any encoded/legacy slugs (e.g., %26) to the normalized hyphenated versions.

Update internal links to point directly to the final slugs (no chains).

5) Outgoing links that currently redirect (update to final targets)

Update anchor href values to the final URL (no intermediate 301):

Amazon book ASIN: replace with the canonical Amazon URL you get after one click (copy from the address bar once it resolves).

Frontiersin article: use its final non-redirecting canonical URL.

danielgoleman.info topics page: use its final resolved URL.

This eliminates “page has links to redirects.”

6) CLS (0.927 on <main id="main-content">) — stabilize layout

Images: add intrinsic sizes and aspect ratios.

For every <img>: set width and height attributes to the actual intrinsic pixel dimensions of the served file (the browser handles scaling).

Add loading="lazy" on below-the-fold images only; do not lazy-load LCP image.

Hero/heading area: reserve space.

Give the hero section a fixed min-height that matches its final layout on first render (mobile & desktop breakpoints).

Web fonts: prevent jumps.

In your font @font-face, add font-display: swap;

Ensure line-height is unitless on large headings (e.g., leading-tight that doesn’t change after font swaps).

Sticky header: if header height changes on scroll, set a fixed height immediately (no transition on first paint).

7) Contrast & focus (accessibility fixes)

Increase contrast for:

Button: “Read the Blog”

Headings in hero and newsletter sections

Adjust token variables only, not component structure. Example:

:root {
  --brand-light: #F8FAFC;
  --brand-dark: #0B1220;         /* ensure body text >= 7:1 on brand-light */
  --brand-emphasis: #0B1220;     /* for buttons/links on light backgrounds */
  --brand-secondary: #E6EEF8;
}


Replace focus:outline-none on the site logo/link with a visible focus style:

a:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }

8) Render-blocking CSS (save ~80ms, help LCP)

Your main CSS is ~14.2 KiB (small, but still flagged). Do this non-destructively:

Inline critical CSS (~3–5 KiB: above-the-fold hero, header, base typography).

Load the rest with the print-swap pattern:

<link rel="preload" href="/css/main.6f284c0b.css" as="style">
<link rel="stylesheet" href="/css/main.6f284c0b.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/css/main.6f284c0b.css"></noscript>


If using Google Fonts, convert to self-hosted CSS and include in the inlined critical block (with font-display: swap).

9) Image delivery (remove ~594 KiB waste)

For the exact files flagged, do not change what the image shows — only how it’s delivered.

Rules

Serve AVIF first, fallback to WebP/JPEG in a <picture>.

Provide responsive srcset and a correct sizes attribute for the displayed width at each breakpoint.

Compress AVIF/WebP a bit more (increase compression factor ~10–20%) on the three heavy images.

Examples (adapt sizes to your design breakpoints):

A) 192×128 thumbnails (currently 640×1024 or 1024×1024)
<picture>
  <source type="image/avif"
          srcset="/images/thumb-192.avif 192w, /images/thumb-384.avif 384w"
          sizes="(min-width: 1024px) 192px, 40vw" />
  <source type="image/webp"
          srcset="/images/thumb-192.webp 192w, /images/thumb-384.webp 384w"
          sizes="(min-width: 1024px) 192px, 40vw" />
  <img src="/images/thumb-192.jpg"
       width="192" height="128" alt="..." loading="lazy" decoding="async">
</picture>

B) 96×96 avatar (was 1024×1024)

Provide 96, 192 for retina; compress harder:

<picture>
  <source type="image/avif" srcset="/images/avatar-96.avif 96w, /images/avatar-192.avif 192w" sizes="96px" />
  <img src="/images/avatar-96.webp" width="96" height="96" alt="Author photo" loading="lazy" decoding="async">
</picture>

C) Hero/LCP image(s)

Do not lazy-load the LCP image.

Still use <picture> with AVIF/WebP, add correct intrinsic width/height, ensure object-fit if cropped.

10) Caching headers (fix “None” on logo, speed repeat views)

Set long cache with content hashing (filenames already hashed: main.6f284c0b.css, etc.):

Static (.css, .js, images, fonts):

Cache-Control: public, max-age=31536000, immutable


HTML:

Cache-Control: public, max-age=0, must-revalidate


Ensure /images/logo-120w.avif?v=b008f571 is served with the 1-year immutable policy.

11) Preconnect (leave off unless you truly call third-party origins)

Report shows no candidates — keep no preconnects to avoid wasted sockets.

12) Internal link hygiene (remove “pages in multiple sitemaps” + GSC redirects)

Update all internal links to the non-www canonical domain.

Replace any internal links that point to a URL that then 301s (e.g., old category slugs with &/%26) so they point directly to the final target.

Ensure every URL listed in the sitemap is indexable (200, canonical to itself, not noindex).

13) Fix the 7 “Page with redirect” examples (GSC)

Remove those URLs from the sitemap and internal links if they redirect.

If a redirect exists only because of case/encoding (e.g., %26), update the internal links to the normalized slug and keep the 301 for safety.

14) Desktop score (hovering ~76): quick wins recap

Inline critical CSS + defer main CSS (Section 8).

Right-size images + AVIF/WebP + accurate sizes (Section 9).

Stabilize hero and fonts to eliminate CLS (Section 6).

Long-cache static assets (Section 10).
These four changes reliably push desktop into the 90s without redesign.

15) QA checklist (run before/after)

 View source: exactly one canonical (https, non-www), no localhost.

 Exactly one meta description; length ≤ 160 chars.

 Titles ≤ 60–65 chars (spot-check the longs listed).

 /newsletter: either live & indexable or completely unlinked 404 with noindex,follow.

 No internal links to redirecting URLs; external scholarly links point to final canonicals.

 Sitemaps only at https://trueallyguide.com/sitemap.xml; “www” sitemap removed.

 Images: LCP not lazy, all images have width/height; thumbnails/avatars downsized per display; AVIF/WebP present.

 CLS on home <main> ≤ 0.05 on Lighthouse.

 Button/hero/newsletter text passes contrast (WCAG AA).

 CSS loaded with preload + print-swap; fonts font-display: swap.

 Cache headers correct (static = 1 year immutable; HTML = must-revalidate).

Notes on the “mobile score jump”

A jump from 76 → 96 can happen when test runs hit different cache/warm states or when network variability changes. The changes above make scores stable by reducing network criticality (critical CSS), bytes (images), and layout shifts (CLS).