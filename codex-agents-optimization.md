🧠 Codex Agent Task: Optimize and Refine trueallyguide.com Frontend, Core Web Vitals & Design
📌 Mission

Your task is to analyze, optimize, and refactor the frontend of trueallyguide.com
 to ensure the entire website achieves and maintains 100/100 scores in Performance, Accessibility, Best Practices, and SEO across both Mobile and Desktop versions.

⚠️ Very Important:
All examples below are based on Google PageSpeed Insights best practices. They are reference examples only — you must adapt and implement them specifically for this website’s structure, layout, components, breakpoints, and content.
You must not degrade existing Core Web Vitals scores — 100% optimization must be preserved or improved.

1. 🖼️ Properly Size and Dimension All Images

Problem: Many images are oversized or incorrectly dimensioned, causing layout shifts, wasted bandwidth, and poor CLS/LCP.

Required Fixes:

Add explicit width and height attributes to all <img> tags to establish aspect ratios before load.

Use the correct aspect-ratio calculation for each image.

Set width: 100%; height: auto; in CSS to ensure proper scaling in responsive layouts.

Example (⚠️ Reference only — adapt to real site images):

<img src="/images/hero.jpg" width="640" height="360" alt="Hero image" loading="lazy">

img {
  width: 100%;
  height: auto;
}

2. 📱 Optimize Responsive Images (srcset, <picture>)

Task: Ensure all responsive image sources maintain a consistent aspect ratio and are properly sized for their breakpoints.

Example (⚠️ Reference only):

<picture>
  <source media="(max-width: 799px)" srcset="/images/hero-480w.jpg" width="480" height="400" />
  <source media="(min-width: 800px)" srcset="/images/hero-800w.jpg" width="800" height="400" />
  <img src="/images/hero-800w.jpg" width="800" height="400" alt="Hero">
</picture>


Use consistent aspect ratios across all variants.

Use cropped versions for smaller screens to minimize file size and maintain proportions.

3. ⚡ Improve Largest Contentful Paint (LCP) — Mobile

Problem: Mobile LCP is ~3.0s, with ~80% delay caused by render blocking and oversized images.

Required Actions:

Preload the LCP image with fetchpriority="high".

Resize and compress LCP images (~587 KiB savings).

Inline critical CSS or load it asynchronously.

Defer non-critical JS and styles.

Example (⚠️ Reference only):

<link rel="preload" as="image" href="/images/hero.avif" fetchpriority="high">

4. 📷 Serve All Images in Next-Gen Formats

Task: Convert and serve all major images in .webp or .avif for improved compression and faster load times.

Example (⚠️ Reference only):

<picture>
  <source srcset="/images/hero.avif" type="image/avif">
  <source srcset="/images/hero.webp" type="image/webp">
  <img src="/images/hero.jpg" width="640" height="360" alt="Hero">
</picture>


Always provide a fallback image for legacy browsers.

5. 🖋️ Improve Color Contrast for Accessibility

Problem: Certain text elements have insufficient contrast (e.g., newsletter headlines).

Required Fix:
Ensure all text meets WCAG 2.1 AA contrast ratios.

Example (⚠️ Reference only):

#newsletter h2 {
  color: #ffffff;
  background-color: #1a1a1a;
}

6. 🔗 Fix Canonical Links

Problem: Multiple conflicting canonical URLs detected.

Solution:

Ensure one valid canonical URL per page.

<link rel="canonical" href="https://trueallyguide.com/">

7. 🖥️ Desktop Optimization Tasks

Properly size all images (~618 KiB savings)

Serve all major images in next-gen formats (~57 KiB savings)

Avoid chaining critical requests (1 chain found)

Reduce long main-thread tasks

Improve desktop LCP (~620 ms)

8. 📱🎨 UI/UX Redesign for Professional Look (Mobile + Desktop)

Problem: On mobile devices, image sizes are disproportionate to article titles, creating an unprofessional and visually unbalanced layout. The desktop version also lacks a polished, professional feel.

New Task:

Analyze and adapt the visual hierarchy, typography, spacing, and image proportions across mobile and desktop views.

Make the entire site’s design feel as professional and visually balanced as leading platforms like Medium or premium WordPress themes.

Ensure images, headlines, and text blocks scale proportionally and look cohesive and eye-pleasing across all screen sizes.

Adjust CSS breakpoints, padding, and grid layouts where needed.

Improve typography hierarchy (e.g., title size vs. image size vs. excerpt text).

Use responsive units (rem, vw, clamp()) for scalable typography and spacing.

⚠️ Critical Rule:
While improving the design, you must not degrade any existing Core Web Vitals metrics.

Performance must remain at 100/100

Accessibility must remain at 100/100

Best Practices must remain at 100/100

SEO must remain at 100/100

The design improvements should enhance visual quality and user experience without reducing performance or optimization.

All text in page articles must not contain weird symbols.

🧰 Final Checklist of Required Actions
Task	Priority	Scope	Target Impact
✅ Properly size and dimension all images	⭐⭐⭐⭐	Site-wide	~600+ KiB savings
✅ Optimize responsive images	⭐⭐⭐	Site-wide	Improved CLS & loading
✅ Improve LCP (preload, inline CSS)	⭐⭐⭐⭐	Mobile	~150–300 ms faster
✅ Serve all images in next-gen formats	⭐⭐⭐	Site-wide	~57 KiB savings
✅ Fix color contrast	⭐⭐	All pages	WCAG AA compliance
✅ Add valid canonical links	⭐⭐	All pages	SEO improvement
✅ Avoid chaining critical requests	⭐⭐	Desktop	Faster first paint
✅ Reduce long main-thread tasks	⭐⭐	Desktop	Smoother UX
✅ Redesign mobile and desktop UI/UX for professional quality	⭐⭐⭐⭐	All pages	Better readability, proportional design, improved UX
⚠️ Final Instruction to Codex

All code examples above are reference examples from Google PageSpeed Insights documentation.

Do NOT copy them verbatim. Instead, analyze the current HTML, CSS, image assets, and layout of trueallyguide.com, and adapt each solution precisely to fit this site’s structure and content.

Your final implementation must improve or maintain existing scores: 100/100 in Performance, Accessibility, Best Practices, and SEO on both Mobile and Desktop.

Do not introduce any changes that degrade these scores — the final site must remain fully optimized while visually redesigned for a professional, premium look.