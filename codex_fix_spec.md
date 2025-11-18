Objective

Fix the blog so that:

Hero image placement on every article page

The first image of the article must appear immediately after the article title and meta (date/reading time).

That image must include its own image caption/meta description directly under the image.

The duplicate/blank white image container that currently appears later on the page must be removed along with its caption block.

Table of contents spacing

Move the Table of Contents so it sits closer to the start of the article body (right above the first paragraph or first H2).

Reduce excessive vertical whitespace above/below the ToC.

Main page author image shape

On the homepage section “My Story: From Burnout to Quiet Strength”, make the author image perfectly circular so the entire face is visible (no odd cropping).

Ensure the placeholder/container is also circular.

Notes: Don’t change visual style elsewhere. Keep current typography and colors. Only adjust layout/spacing/styles needed to satisfy the points above.

Where to look (search first)

Search these locations and filenames (they may differ by framework, so locate the closest matches and modify accordingly):

Article template (one of):

pages/posts/[slug].*, pages/blog/[slug].*

templates/post.*, templates/article.*

layouts/post.*, layouts/article.*

Static-site variants: src/templates/post.js, src/layouts/article.*, themes/*/layouts/post.*

Liquid/Nunjucks/11ty: post.njk, post.liquid, post.html

Homepage / author section (one of):

pages/index.*, src/pages/index.*, templates/home.*, components/Author*.*, components/HeroAuthor*.*

Table of contents component (if separate):

components/TableOfContents.*, components/ToC.*, or a block inside the article template.

Styles:

Global CSS/SCSS: styles/*, assets/css/*, src/styles/*

Component-scoped styles next to the templates.

If file names differ, review the project and operate on the correct equivalents.

Implementation details
1) Article hero image (AFTER title/meta; remove later duplicate)

Algorithm (framework-agnostic):

Determine the hero image source in this order:

If front-matter / data has a featuredImage (or hero_image, cover, image), use it.

Else, extract the first image from the article content, remove it from the rendered body, and use it as the hero.

In the article template, render this hero block immediately after the title and meta block:

<article>
  <header class="post-header">
    <h1 class="post-title">{{ title }}</h1>
    <div class="post-meta">{{ date }} · {{ readingTime }}</div>

    {% if heroImage %}
      <figure class="post-hero">
        <img src="{{ heroImage.src }}" alt="{{ heroImage.alt }}">
        {% if heroImage.caption %}
          <figcaption class="image-caption">{{ heroImage.caption }}</figcaption>
        {% endif %}
      </figure>
    {% endif %}
  </header>

  <!-- Table of Contents will sit here (see section 2) -->

  <div class="post-content">
    {{ contentWithoutFirstImage }}
  </div>
</article>


If the stack is React/Next/Gatsby, implement the same structure in JSX.
If the renderer doesn’t easily let you remove the first image, pre-process the Markdown AST (e.g., remove the first image node and capture its url, alt, and adjacent caption text).

CSS (add or extend):

.post-hero {
  margin: 1.25rem 0 1.5rem;
}
.post-hero img {
  width: 100%;
  height: auto;
  display: block;
  border-radius: 8px; /* keep current style if different */
}
.image-caption {
  font-size: 0.9rem;
  line-height: 1.4;
  opacity: 0.85;
  margin-top: 0.5rem;
  text-align: left; /* or center to match site style */
}


Remove duplicate/blank placeholder:

Find where a second image container (often an empty <figure> or placeholder div) is rendered below the intro. Delete that render and any related caption/meta description block.

If it’s injected by a component (e.g., CoverImage, Hero, ImagePlaceholder), ensure it does not render on article pages (or only renders in the header position above).

2) Move Table of Contents closer to the text

Placement:

Render the ToC after the hero image block and before the first paragraph/H2 of .post-content.

If ToC is currently floating far above, relocate its markup accordingly.

CSS spacing:

.toc {
  margin: 0.75rem 0 1rem;   /* tighter vertical spacing */
}
.toc h2, .toc h3 { margin-top: 0; }

3) Circle author image on homepage (“My Story” section)

HTML/JSX adjustments:

Ensure the author image has a dedicated wrapper and class, e.g., .author-photo applied to the <img> or its container.

CSS (make it perfectly circular):

.author-photo,
.author-photo img {
  width: 160px;              /* adjust to match design */
  height: 160px;             /* keep 1:1 ratio */
  border-radius: 50%;
  overflow: hidden;
  display: block;
}
.author-photo img {
  object-fit: cover;         /* fill circle without distortion */
  object-position: center;   /* keep face centered */
}


If a rectangular placeholder is used:

Apply the same classes to the placeholder element (or wrap it) so it renders as a circle too.

Acceptance criteria (must pass)

Article pages

The first image appears directly after the main title + meta.

The image shows with a caption/meta description (from alt/front-matter caption or the original caption text).

The duplicate/blank white image container that previously appeared later is no longer present.

The ToC displays just below the hero image and above the first paragraph/H2, with tight spacing (no large blank gaps).

Homepage

The author photo in “My Story: From Burnout to Quiet Strength” is a perfect circle, the whole face is visible, and the container/placeholder is circular as well.

Regression checks

No layout shift on non-article pages besides the homepage author photo.

Images retain responsive behavior (no overflow, no stretching).

Lighthouse/console has no new errors.

Hints for the code reviewer (Codex)

If you cannot definitively identify the correct template(s), inspect the routing and component tree to locate where article pages and the homepage are assembled, then apply the changes there.

When extracting the first image from Markdown, if the stack uses remark/rehype, write a small plugin to capture/remove the first image node and pass it to the page template as heroImage.

If front-matter includes both featuredImage and an inline first image, prefer featuredImage and leave the inline image untouched (unless it is the same URL — then de-duplicate).

Keep class names consistent with existing conventions; if adding new ones (post-hero, image-caption, author-photo, toc), do so minimally and reuse existing utility classes if present (Tailwind etc.).

What to change (commit checklist)

 Article template: insert hero block after title/meta; wire data from front-matter or first inline image.

 Content pipeline: remove first inline image from body when promoted to hero.

 Delete/disable the second/placeholder image block lower in the article.

 Reposition ToC between hero and first paragraph/H2; tighten margins.

 Homepage “My Story” author image: apply circular styling and object-fit center; make placeholder circular too.

 Add/update CSS as shown; ensure no adverse impact elsewhere.

 Test on at least two articles and the homepage.

Done definition

When I open any article, I see: Title → Meta → Hero image (with caption) → ToC → Article text, with no extra blank image container. On the homepage, the author image is circular and shows the full face.