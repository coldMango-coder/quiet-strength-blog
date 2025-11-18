You are editing a CRA React project.

Only edit this one file:

- src/styles/theme-additions.css

Do NOT touch any JS/TS/JSX/HTML or other CSS files.
Do NOT change Core Web Vitals configuration.

GOAL
====

On the About page (#about) there is an avatar:

```html
<div class="mx-auto hero-about-card author-photo">
  <img class="author-avatar" ... />
</div>
I want:

The avatar to be a perfect circle.

The ENTIRE photo (whole head/face) visible inside the circle.

NO white gaps / flat cut along the bottom.

The change must be LOCAL to the About avatar only (no effect on blog post avatars).

We will achieve this with ONE container rule and ONE image rule.

IMPORTANT CONSTRAINTS
Only change selectors that start with:

#about .hero-about-card.author-photo

#about .hero-about-card.author-photo img.author-avatar

Do NOT modify any other selectors (e.g. .author-photo img, .article-author, blog avatars, etc.).

At the end there must be exactly:

ONE rule for #about .hero-about-card.author-photo

ONE rule for #about .hero-about-card.author-photo img.author-avatar

Do NOT add more rules for these selectors.

Do NOT change anything else in the file.

STEP 1 – Remove old rules for these selectors
In src/styles/theme-additions.css, find all CSS rules whose selector is exactly:

#about .hero-about-card.author-photo

#about .hero-about-card.author-photo img.author-avatar

A rule means: the selector line plus everything until its matching closing }.

DELETE every existing rule block for those two selectors.

After this deletion there must be no rule left that uses either of these selectors.

STEP 2 – Add the new container + image rules
At the end of the file (after all existing CSS), insert exactly these two blocks:

css
Copy code
/* About page hero card: avatar container */
#about .hero-about-card.author-photo {
  width: 144px;
  height: 144px;
  border-radius: 9999px; /* perfect circle */
  overflow: hidden;      /* anything outside the circle is hidden */
  margin-inline: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* About page hero card: avatar image */
#about .hero-about-card.author-photo img.author-avatar {
  width: 100% !important;
  height: 100% !important;
  border-radius: 9999px;           /* matches the container circle */
  object-fit: cover;               /* fill the circle, no white gaps */
  object-position: 50% 40%;        /* move crop slightly down so whole face is inside */
  display: block;
}
Notes:

overflow: hidden on the container + border-radius: 9999px creates the circular mask.

width: 100% and height: 100% on the image make it always fill that mask.

object-fit: cover avoids white space.

object-position: 50% 40% nudges the crop slightly downward so the full head/face is visible.

STEP 3 – Sanity check
Make sure there are no other rules anywhere in this file that use:

#about .hero-about-card.author-photo

#about .hero-about-card.author-photo img.author-avatar

The only occurrences of those selectors should be in the two blocks you just inserted.

OUTPUT FORMAT
Return only a unified diff for this file:

src/styles/theme-additions.css

Do not include explanations, logs, or any other text outside the diff.



