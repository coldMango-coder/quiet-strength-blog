# Blog Post Template

Use this template to create new blog posts with the correct structure. Fill out all sections and then use the blog creation script.

## Blog Post Information

- **Title**: [Your compelling blog post title]
- **Category**: [Choose from: "Introversion & Personality", "Relationships & Dating", "Career & Workplace", "Self-Development", "Women's Wellness"]
- **Description**: [SEO meta description - 150-160 characters max]
- **Author**: Marica Šinko
- **Keywords**: [5-10 comma-separated SEO keywords]
- **Featured Image**: [Path to image file, e.g., "/images/your-image.jpg"]

## Blog Post Content

[Write your full blog post content here using Markdown formatting]

### Introduction
[Hook the reader and introduce the topic]

### Main Content
[Organize your content with clear headings and subheadings]

### Conclusion
[Summarize key points and include a call to action]

---

## How to Use This Template

1. **Fill out the blog information** above with your specific details
2. **Write your content** in the "Blog Post Content" section
3. **Save this file** with a descriptive name (e.g., `confidence-building-blog.md`)
4. **Run the creation script**:
   ```bash
   node scripts/create-blog-post.js \
     --title "Your Blog Title" \
     --category "Self-Development" \
     --description "Your meta description" \
     --file templates/your-template-file.md \
     --keywords "keyword1,keyword2,keyword3"
   ```

## Blog Structure Guidelines

### Title Best Practices
- Include target keywords naturally
- Make it compelling and specific
- Keep it under 60 characters for SEO
- Use numbers when relevant (e.g., "7 Ways to...")

### Category Guidelines
- **Introversion & Personality**: Posts about introvert traits, strengths, and challenges
- **Relationships & Dating**: Dating advice, relationship tips, communication
- **Career & Workplace**: Professional development, workplace strategies
- **Self-Development**: Personal growth, confidence, life skills
- **Women's Wellness**: Health, wellness, and lifestyle topics

### Content Structure
1. **Introduction** (150-200 words)
   - Hook with a relatable scenario or statistic
   - State the problem clearly
   - Preview what the reader will learn

2. **Main Content** (800-1500 words)
   - Use clear headings and subheadings
   - Include actionable tips and strategies
   - Add examples and case studies
   - Use bullet points and numbered lists

3. **Conclusion** (100-150 words)
   - Summarize key takeaways
   - Include a call to action
   - Encourage engagement

### SEO Guidelines
- Use target keywords naturally throughout
- Include keywords in headings when appropriate
- Write for humans first, search engines second
- Include internal links to related blog posts

## Example Usage

```bash
# Create a new blog post about introvert productivity
node scripts/create-blog-post.js \
  --title "Productivity Hacks for Introverts: 8 Strategies That Actually Work" \
  --category "Self-Development" \
  --description "Discover 8 proven productivity strategies designed specifically for introverts. Boost your efficiency while honoring your natural energy patterns." \
  --file templates/productivity-blog-content.md \
  --keywords "introvert productivity,productivity tips,introvert strategies,time management,energy management" \
  --image "/images/introvert-productivity.jpg"
```

This will automatically:
- Generate the correct YAML frontmatter
- Create a URL-friendly slug
- Add the canonical link
- Calculate reading time
- Update the sitemap
- Create the markdown file in the public folder

## Content Quality Checklist

Before publishing, ensure your blog post has:

- [ ] Compelling, keyword-optimized title
- [ ] Clear meta description under 160 characters
- [ ] Well-structured content with headings
- [ ] Actionable advice and practical tips
- [ ] Engaging introduction that hooks the reader
- [ ] Strong conclusion with clear takeaways
- [ ] Relevant keywords used naturally
- [ ] Appropriate featured image
- [ ] Error-free grammar and spelling
- [ ] Links to relevant resources or other blog posts