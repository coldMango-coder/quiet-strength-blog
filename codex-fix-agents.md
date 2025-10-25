Fix Unresponsive Category Section Layout (Mobile + Desktop)

Problem:
On category and listing pages, the article titles are splitting into multiple short horizontal lines (“staircase” text), making the layout look unprofessional and hard to read. This occurs on both mobile and desktop due to overly narrow card widths, rigid grid settings, and poor typography scaling.

Required Fixes:

1. Responsive grid system with minimum column widths

The category grid must dynamically adapt to viewport size using auto-fit and minmax() to prevent cards from shrinking too much.

✅ Required implementation:

.category-grid,
.posts-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (min-width: 768px) {
  .category-grid,
  .posts-grid {
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  }
}

@media (min-width: 1280px) {
  .category-grid,
  .posts-grid {
    grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
    gap: 2rem;
  }
}


✅ Mobile: Cards won’t collapse below ~300px, preventing narrow columns and excessive line breaks.

✅ Desktop: Cards stay wide enough (~360px+) to keep titles readable on one or two lines.

2. Limit max width of text containers

Ensure text doesn’t become too wide on large screens by constraining the max width of text blocks.

.card-title {
  max-width: 34rem; /* ~544px, keeps titles readable */
  text-wrap: balance;
  overflow-wrap: break-word;
  hyphens: auto;
}

3. Responsive typography scale (desktop + mobile)

Use clamp() to scale titles smoothly across breakpoints and prevent tiny or oversized text:

.card-title {
  font-weight: 800;
  font-size: clamp(1.15rem, 1rem + 1.2vw, 1.8rem);
  line-height: 1.25;
  letter-spacing: -0.01em;
}

.card-excerpt {
  font-size: clamp(0.95rem, 0.9rem + 0.5vw, 1.05rem);
  line-height: 1.6;
  max-width: 65ch;
}

4. Consistent thumbnail aspect ratio

Ensure all category cards use the same aspect ratio to avoid inconsistent heights and content flow:

.card-thumb {
  aspect-ratio: 4 / 3; /* or 16 / 9 site-wide */
  border-radius: 0.75rem;
  overflow: hidden;
}
.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

5. Fix sizes and srcset for category thumbnails

Match the image sizes to the actual rendered width across breakpoints. Example:

<img
  src="/images/card-thumb-360.avif"
  srcset="/images/card-thumb-240.avif 240w,
          /images/card-thumb-300.avif 300w,
          /images/card-thumb-360.avif 360w"
  sizes="(max-width: 640px) 300px, (max-width: 1024px) 320px, 360px"
  width="360" height="240"
  loading="lazy" decoding="async"
  class="w-full h-auto object-cover"
  alt="Article thumbnail"
/>

✅ Final Acceptance Criteria

✅ Category and listing pages look professional on both desktop and mobile.

✅ Titles no longer break into many short horizontal lines.

✅ Cards maintain consistent width and aspect ratio.

✅ All srcset and sizes values match real rendered widths.

✅ Lighthouse/PageSpeed audits for “Properly size images” and “Layout Shift” pass.

✅ Performance, Accessibility, Best Practices, and SEO scores remain 100/100.

⚠️ Critical Rule

While implementing all these changes, you must not reduce Core Web Vitals or Lighthouse scores. They may only stay the same or improve.