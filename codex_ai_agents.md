Purpose

Bring Quiet Strength Blog to a polished, professional UI/UX that aligns with WordPress/Medium norms and boosts SEO/Lighthouse scores. Apply changes globally across all pages and previously published articles.

High-Level Goals (Do all)

Professional Typography System (desktop & mobile)

Reduce oversized headings/paragraphs, improve line length/height, spacing, and mobile readability.

Use CSS custom properties + clamp() for fluid sizing.

Enforce max readable measure (~65–75ch) for article text.

Harmonize list/blockquote spacing and heading hierarchy (H1/H2/H3).

Auto Table of Contents (TOC) with H2/H3 hierarchy

Generate from the article DOM (h2, h3) with anchor links.

Fix numbering and indentation alignment.

Highlight current section on scroll.

Works for all existing articles without manual lists.

Author photo crop fix (About section on homepage & any “About me” blocks)

Ensure the entire face is visible inside the circular avatar.

Prefer object-contain fallback with centered object position if object-cover crops too tight.

Accepts a data-focal override if needed later.

Footer cleanup + Legal pages

Replace build meta line (“Build: production · Commit: ${VERCE…} · Built: Invalid Date”) with brand-appropriate copy and dynamic year. Keep short commit hash when available—but formatted cleanly.

Add Privacy Policy page (currently broken) and a new Terms of Use page; link them in footer.

Provide professional, site-appropriate starter content.

SEO & Performance

Preserve existing canonical/prerendering flow.

Ensure TOC + legal pages are included in sitemap and prerendered.

Add basic accessibility wins (skip link, landmark roles).

Repository Context (given)

React SPA with prerendered static HTML for SEO.

Tailwind-like utility classes in components.

Structure:

src/components, src/pages, src/styles, public/, scripts/.

SEO utilities + <Seo /> component and prerenderer.

Footer currently shows commit meta based on VERCEL_GIT_COMMIT_SHA.

Deliverables & Acceptance Criteria
A. Typography (Global)

Fluid, accessible font scale using CSS variables + clamp().

Desktop:

H1 ~ 40–48px, H2 ~ 28–32px, H3 ~ 22–24px, body ~ 18–19px.

Line-height: headings 1.2–1.3; body 1.65–1.8.

Article measure: max 72ch, paragraphs spaced 0.8–1em.

Mobile (≤ 640px):

H1 ~ 28–32px, H2 ~ 22–24px, H3 ~ 18–20px, body ~ 16–17px.

Comfortable spacing; no jumbo blocks.

Lists and blockquotes look balanced; images fit the measure.

Done when: On mobile, text no longer looks “huge,” headings/paragraphs feel like Medium; Lighthouse/AXE show good contrast/legibility; CLS unaffected.

B. Table of Contents

<TableOfContents /> component builds nested H2/H3 list with correct numbering and even left indentation; no misaligned last item.

Click scrolls with offset (accounts for sticky headers); active item highlights on scroll.

Adds id anchors to headings if missing (slugified from text).

Replaces manual TOC blocks in all articles.

Done when: All published articles show a consistent, nested TOC with aligned numerals and functional anchors.

C. Author Photo

Circular avatar shows full face (no half-crop).

Default: object-fit: contain with white background fill inside circle; fallback to object-cover object-center when source is already square/centered.

Support optional style={{ objectPosition: 'center 20%' }} via prop for fine tuning.

Done when: The face is fully visible on the homepage About section and any article bios.

D. Footer & Legal

Footer line becomes:
© {currentYear} Quiet Strength — Empowering introverted women to thrive.
If REACT_APP_COMMIT_SHA exists, append · Build {shortSha}.

Add footer links: Privacy Policy and Terms of Use (new).

Implement routed pages /privacy-policy and /terms with professional starter content.

Ensure links work in prerendered HTML and are added to sitemap.xml.

Done when: Footer looks clean, links navigate to real pages, prerender includes both pages, and sitemap lists them.

Exact Changes (by file)

Create/Modify only the files called out below. Keep all other functionality intact.

1) src/styles/typography.css (NEW)

Create a global, fluid type system and article typography.

:root{
  --fs-0: clamp(0.94rem, 0.85rem + 0.3vw, 1.05rem); /* small */
  --fs-1: clamp(1.00rem, 0.90rem + 0.45vw, 1.12rem); /* base */
  --fs-2: clamp(1.125rem, 1.00rem + 0.7vw, 1.22rem); /* body+ */
  --fs-h3: clamp(1.12rem, 0.9rem + 1.5vw, 1.375rem);
  --fs-h2: clamp(1.35rem, 1.0rem + 2.2vw, 2rem);
  --fs-h1: clamp(1.75rem, 1.2rem + 4.0vw, 3rem);

  --lh-body: 1.72;
  --lh-heading: 1.25;

  --measure: 72ch;
  --space-1: 0.5rem;
  --space-2: 0.8rem;
  --space-3: 1.25rem;
  --space-4: 2rem;
}

html { font-size: 16px; }
body {
  font-size: var(--fs-1);
  line-height: var(--lh-body);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* Article defaults */
.article-container {
  max-width: var(--measure);
}

.article-container h1,
.article-container h2,
.article-container h3 {
  line-height: var(--lh-heading);
  font-weight: 800;
  color: #0f172a; /* brand-dark fallback */
  margin: var(--space-4) 0 var(--space-2);
}

.article-container h1 { font-size: var(--fs-h1); margin-top: 0; }
.article-container h2 { font-size: var(--fs-h2); }
.article-container h3 { font-size: var(--fs-h3); }

.article-container p,
.article-container li {
  font-size: var(--fs-2);
}

.article-container p { margin: var(--space-2) 0; }

.article-container ul,
.article-container ol {
  margin: var(--space-3) 0 var(--space-3) 1.2rem;
  padding-left: 0.4rem;
}

.article-container blockquote {
  margin: var(--space-4) 0;
  padding: 1rem 1.25rem;
  border-left: 4px solid #e2e8f0;
  background: #f8fafc;
}

/* Prevent giant paragraphs on mobile */
@media (max-width: 640px){
  .article-container { padding-left: 0.75rem; padding-right: 0.75rem; }
}

2) Import global styles

If you have a styles index, import there; otherwise import in src/App.js once:

// src/App.js
import './styles/typography.css';

3) src/components/TableOfContents.js (NEW)

Auto-build nested H2/H3 TOC with aligned numbering and scroll spy.

import React, {useEffect, useMemo, useState} from 'react';

const slugify = (str) =>
  str.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

export default function TableOfContents({ rootSelector = 'article' }){
  const [items, setItems] = useState([]);

  useEffect(() => {
    const root = document.querySelector(rootSelector);
    if(!root) return;

    const headings = [...root.querySelectorAll('h2, h3')];
    const nodes = headings.map(h => {
      if(!h.id){ h.id = slugify(h.textContent); }
      return { id: h.id, text: h.textContent, level: h.tagName === 'H2' ? 2 : 3 };
    });

    // Build nested structure (H2 -> children H3)
    const out = [];
    let current = null;
    nodes.forEach(n => {
      if(n.level === 2){ current = {...n, children: []}; out.push(current); }
      else if(current){ current.children.push(n); }
      else { out.push(n); }
    });
    setItems(out);
  }, [rootSelector]);

  // Scroll spy
  const [activeId, setActiveId] = useState(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
        if(visible){ setActiveId(visible.target.id); }
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 1] }
    );
    document.querySelectorAll('article h2, article h3').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav aria-label="Table of contents" className="bg-white p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-3">Table of Contents</h2>
      <ol className="space-y-2 pl-4 list-decimal toc-root">
        {items.map((h2, i) => (
          <li key={h2.id} className="marker:font-semibold">
            <a href={`#${h2.id}`} className={`hover:underline ${activeId===h2.id?'text-brand-emphasis':'text-slate-700'}`}>
              {h2.text}
            </a>
            {Array.isArray(h2.children) && h2.children.length > 0 && (
              <ol className="mt-2 pl-6 list-decimal">
                {h2.children.map((h3) => (
                  <li key={h3.id} className="text-slate-700">
                    <a href={`#${h3.id}`} className={`hover:underline ${activeId===h3.id?'text-brand-emphasis':''}`}>
                      {h3.text}
                    </a>
                  </li>
                ))}
              </ol>
            )}
          </li>
        ))}
      </ol>
      <style>{`
        /* Align numbers edge so final item doesn't shift left */
        .toc-root { counter-reset: item; }
        .toc-root > li { padding-left: 0.15rem; }
        .toc-root ol > li { padding-left: 0.15rem; }
      `}</style>
    </nav>
  );
}

4) Use new TOC in blog posts

Replace the manual TOC block in your blog templates with the component above.

In src/components/BlogPost[Title].js template (or any page using a manual TOC), swap the “Table of Contents” section with:

{/* TABLE OF CONTENTS - Auto-generated */}
<section className="mb-16">
  <TableOfContents rootSelector="article" />
</section>


and add the import at the top:

import TableOfContents from '../components/TableOfContents';


Also: Ensure the main article wrapper retains the class article-container so typography rules apply.

5) Author photo crop fix

A. Create a tiny helper src/components/SafeAvatar.js:

import React from 'react';

export default function SafeAvatar({ src, alt, size=96, containFallback=true, objectPosition='center' }){
  const style = { width: size, height: size };
  return (
    <div className="rounded-full overflow-hidden shadow-md" style={style} aria-hidden="true">
      <img
        src={src}
        alt={alt}
        className={containFallback ? 'w-full h-full object-contain bg-white' : 'w-full h-full object-cover'}
        style={{ objectPosition }}
        loading="lazy"
      />
    </div>
  );
}


B. Replace avatar usages

In homepage About section and article author bios, replace the current <img> avatar with:

import SafeAvatar from '../components/SafeAvatar';

// ...
<SafeAvatar src="/images/your-author-photo.jpg" alt="Portrait of Marica Šinko" size={96} containFallback={true} objectPosition="center 30%" />


This guarantees the whole face is visible; adjust objectPosition if needed without cropping.

6) Footer cleanup

A. Edit your footer component (create if missing): src/components/Footer.js

import React from 'react';

function year(){ return new Date().getFullYear(); }
function shortSha(){
  const sha = process.env.REACT_APP_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || '';
  return sha ? sha.substring(0,7) : '';
}

export default function Footer(){
  const sha = shortSha();
  return (
    <footer className="mt-24 border-t">
      <div className="container mx-auto px-6 py-10 grid gap-6 md:grid-cols-3 text-slate-300 bg-slate-900">
        <div>
          <h4 className="font-bold text-white">Quiet Strength</h4>
          <p className="mt-2 max-w-[40ch]">Empowering introverted women to thrive.</p>
        </div>
        <nav className="space-y-2">
          <a href="/about" className="block hover:underline">About</a>
          <a href="/blog" className="block hover:underline">Blog</a>
          <a href="/books" className="block hover:underline">Books</a>
          <a href="/privacy-policy" className="block hover:underline">Privacy Policy</a>
          <a href="/terms" className="block hover:underline">Terms of Use</a>
        </nav>
        <div className="text-sm md:text-right">
          <div>© {year()} Quiet Strength — Empowering introverted women to thrive.{sha && ` · Build ${sha}`}</div>
        </div>
      </div>
    </footer>
  );
}


B. Ensure <Footer /> is rendered in App.js (or your main layout).

7) Legal pages

Create: src/pages/PrivacyPolicy.js

import React from 'react';
import Seo from '../components/Seo';

export default function PrivacyPolicy(){
  return (
    <div className="container mx-auto px-6 py-16 article-container">
      <Seo title="Privacy Policy" description="How Quiet Strength collects, uses, and protects your information." path="/privacy-policy" />
      <h1>Privacy Policy</h1>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>

      <h2>Overview</h2>
      <p>Quiet Strength (“we”, “us”, “our”) operates this website to provide educational content for women’s personal and professional growth.</p>

      <h2>Information We Collect</h2>
      <h3>Voluntary Information</h3>
      <p>When you subscribe, comment, or contact us, we collect your name, email, and any message you send.</p>
      <h3>Automatic Data</h3>
      <p>We use cookies and analytics to understand traffic and improve content. You can control cookies in your browser.</p>

      <h2>How We Use Information</h2>
      <ul>
        <li>To deliver content and newsletters you request</li>
        <li>To improve site performance and user experience</li>
        <li>To respond to inquiries and support requests</li>
      </ul>

      <h2>Third-Party Services</h2>
      <p>We may use reputable providers (e.g., hosting, analytics). They process data on our behalf under contractual safeguards.</p>

      <h2>Your Choices</h2>
      <p>You may unsubscribe at any time via the link in our emails. Contact us to request access or deletion of your data where applicable.</p>

      <h2>Contact</h2>
      <p>Email: hello@trueallyguide.com</p>
    </div>
  );
}


Create: src/pages/Terms.js

import React from 'react';
import Seo from '../components/Seo';

export default function Terms(){
  return (
    <div className="container mx-auto px-6 py-16 article-container">
      <Seo title="Terms of Use" description="Terms governing the use of Quiet Strength." path="/terms" />
      <h1>Terms of Use</h1>
      <p>Last updated: {new Date().toISOString().slice(0,10)}</p>

      <h2>Acceptance of Terms</h2>
      <p>By accessing or using this website, you agree to these Terms of Use and our Privacy Policy.</p>

      <h2>Content & Disclaimer</h2>
      <p>All content is for informational purposes only and is not medical, psychological, legal, or financial advice.</p>

      <h2>Intellectual Property</h2>
      <p>Content on this site is owned by Quiet Strength unless otherwise noted. You may link to our articles but may not republish without permission.</p>

      <h2>User Conduct</h2>
      <ul>
        <li>Do not post harmful, unlawful, or infringing content.</li>
        <li>Do not attempt to disrupt site operation or security.</li>
      </ul>

      <h2>Links</h2>
      <p>We may link to external resources. We are not responsible for their content or practices.</p>

      <h2>Changes</h2>
      <p>We may update these Terms. Continued use means you accept the changes.</p>

      <h2>Contact</h2>
      <p>Email: hello@trueallyguide.com</p>
    </div>
  );
}


Routing: If you use file-based routing, ensure these pages are registered. If you use a central router, add routes:

// wherever routes are defined
<Route path="/privacy-policy" element={<PrivacyPolicy />} />
<Route path="/terms" element={<Terms />} />

8) Sitemap & Prerender updates

Ensure public/sitemap.xml includes /privacy-policy and /terms. If you generate dynamically (scripts/generate-sitemap-dynamic.js), append those two static routes.

Confirm prerender script (scripts/prerender.mjs) picks up both URLs from the sitemap (it already does per README).

9) Accessibility niceties (small but valuable)

Add a skip link in your main layout:

<a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-white px-3 py-2 rounded shadow">
  Skip to content
</a>
<main id="main"> ... </main>

Bulk Refactor: Replace manual TOCs

Search & replace across src/**/*.js:

Remove any hard-coded “Table of Contents” lists used inside articles.

Insert the <TableOfContents /> component as shown above.

Keep heading tags (<h2>, <h3>) in the content so the component can auto-build the tree. Avoid using bold <p> as pseudo-headings.

Environment & Footer Commit Hash

Keep mapping: REACT_APP_COMMIT_SHA ← VERCEL_GIT_COMMIT_SHA.

The new footer automatically shortens the SHA if present; if not, it shows no build chunk (no “Invalid Date” ever).

If needed, add to build config:

# In Vercel/CI env vars
REACT_APP_COMMIT_SHA=$VERCEL_GIT_COMMIT_SHA

Tests & Checks

Visual

Mobile (375–430px): headings/paragraphs look like Medium sizes; no jumbo blocks.

TOC nested correctly; last number aligns with others.

Avatar shows full face (no cropping).

Footer line is clean; links to Privacy and Terms render pages.

SEO/Perf

npm run prerender completes with the two new routes captured.

public/sitemap.xml lists /privacy-policy and /terms.

Lighthouse (mobile): Typography legible; no tap target issues; SEO passes.

Automated

Add a simple unit test for slugify if you maintain tests, and a Playwright check that TOC anchors exist for a sample article.

Commit Message Template
feat(ui/seo): professional typography, auto TOC, safe avatar crop, footer cleanup, privacy & terms pages

- Add fluid typography scale using CSS variables + clamp()
- Implement auto-generated H2/H3 TableOfContents with scroll spy & aligned numbering
- Introduce SafeAvatar to avoid face cropping in circular avatars
- Replace footer build meta with clean brand line + optional short commit
- Add /privacy-policy and /terms pages; link from footer
- Update sitemap & prerender to include new legal routes

Rollback Plan

Revert typography.css import and remove the file.

Swap <TableOfContents /> back to manual lists if required.

Restore previous Footer component and remove legal pages & routes.

Regenerate sitemap.

🚨 Non-Negotiable Requirement: Do NOT Degrade Core Web Vitals

MUST NOT perform any change that worsens current Core Web Vitals on mobile or desktop. All edits must be performance-neutral or better.

Hard Budgets & Targets (post-change, lab + prerendered HTML)

LCP ≤ 2.5s (mobile emulation) and ≤ 2.0s (desktop)

CLS ≤ 0.05 (target), 0.10 max (must not exceed)

INP (or FID if older tooling) ≤ 200ms

Bundle size delta: ≤ +25 KB gzip total (JS + CSS) versus main before changes

No new blocking resources: don’t add render-blocking scripts or styles

Performance Guardrails (follow for every edit)

No new libraries unless approved in this file. Use vanilla React + existing stack.

Fonts: don’t add new font files; if touching CSS, keep font-display: swap.

Images: keep explicit width/height attributes; use loading="lazy"; preserve current WebP/AVIF optimizations.

Layout stability: reserve space for TOC, images, avatars; avoid DOM injections that shift layout above the fold.

Scripts: any new behavior (e.g., TOC scroll-spy) must be idle/deferred and use IntersectionObserver only; no polling, no synchronous measurements.

CSS: prefer static CSS over runtime JS where possible; avoid huge utility explosions—reuse classes and new global stylesheet is fine.

Prerender: prerendered HTML must remain valid; no client-only SEO tags.

Accessibility: changes must not remove ARIA/semantic structure; better accessibility often improves CWV and UX.

Verification (Codex must run)

npm run build && npm run prerender

Lighthouse (mobile + desktop) on a representative article and the home page; scores must not drop and CWV thresholds above must hold.

If any metric regresses: rollback that specific change and adjust.

Small Code Tweaks to Enforce CWV Safety

1) TOC component (no layout shift + idle init)
Replace the <nav> opening in src/components/TableOfContents.js with this version to pre-reserve space and avoid jank:

// (inside component return)
<nav aria-label="Table of contents" className="bg-white p-6 rounded-lg shadow-sm min-h-[120px]">


Add idle init for the observer so it doesn’t compete with LCP:

useEffect(() => {
  const start = () => {
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '0px 0px -70% 0px', threshold: [0, 0.2, 1] }
    );
    document.querySelectorAll('article h2, article h3').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  };
  if ('requestIdleCallback' in window) {
    const id = window.requestIdleCallback(start, { timeout: 1500 });
    return () => window.cancelIdleCallback && window.cancelIdleCallback(id);
  }
  return start();
}, []);


2) Images & avatar (explicit sizing to avoid CLS)
Wherever we render images (including the new SafeAvatar), keep explicit width/height (or a fixed style size on the wrapper). The SafeAvatar already sets width/height on the wrapper; keep that as is.

3) Global CSS (no new blocking)
The new src/styles/typography.css is a tiny file; it’s imported once. Do not add additional global CSS files or external stylesheets. Keep the file under 3 KB (roughly what you already have).

4) Routing & legal pages
Pages are standard React components; no extra libraries, no client-side redirects. They rely on existing <Seo /> and prerender—zero impact to LCP.

Extra Acceptance Criteria (add to the earlier “Deliverables & Acceptance Criteria”)

Core Web Vitals parity or better confirmed via Lighthouse (mobile & desktop) after all changes:

LCP, CLS, INP meet the budgets above on:

Home (/)

A long article page (with images + TOC)

/privacy-policy

No new network requests above the fold except existing bundles and images already present.

Sitemap & prerender still succeed with no increase in prerender time > +5%.

CI/Local Checks (Codex should wire or run, no new deps)

Run:

npm run build && npm run prerender
npx lighthouse http://localhost:5173 --preset=desktop --quiet
npx lighthouse http://localhost:5173 --preset=mobile --quiet


Compare LCP/CLS/INP numbers to previous main; if worse, adjust before commit.