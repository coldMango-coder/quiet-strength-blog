# Blog Structure Requirements for truellyguide.com

## CRITICAL REQUIREMENTS FOR EVERY BLOG POST

### 1. External Links (MANDATORY FOR SEO)
**REQUIREMENT: Minimum 6-8 credible external links per blog post**

#### Acceptable External Link Sources:
- **.edu domains** (universities, academic institutions)
- **.gov domains** (government health agencies, research institutes)
- **Research journals** (Frontiers in Psychology, Nature, Science, Psychology journals)
- **Professional organizations** (APA, NIH, CDC, Sleep Foundation)
- **Credible health organizations** (Mayo Clinic, Cleveland Clinic)
- **Academic psychology sources** (Simply Psychology, Positive Psychology)

#### ❌ AVOID THESE DOMAINS (Known Issues):
- **NCBI/PubMed domains** - Frequently show maintenance messages
- **Generic university homepages** - Not specific enough for citations
- **Taylor & Francis** - Access restrictions
- **Commercial .com sites** without clear academic authority

#### WORKING EXTERNAL LINKS (verified 2025):
- **Narcissism & Personality Research**: https://www.frontiersin.org/articles/10.3389/fpsyg.2021.647539/full
- **Psychological Research**: https://www.frontiersin.org/articles/10.3389/fpsyg.2020.590748/full
- **Stress Research**: https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2024.1471084/full
- **NIH Stress Research**: https://www.nhlbi.nih.gov/news/2025/risk-score-offers-new-way-assess-impact-stress-can-have-heart
- **Psychology Education**: https://www.simplypsychology.org/introvert-extrovert.html
- **CDC Sleep Research**: https://www.cdc.gov/sleep/about/index.html
- **Sleep Foundation**: https://www.sleepfoundation.org/how-sleep-works/why-do-we-need-sleep
- **APA Social Media**: https://www.apa.org/members/content/social-media-research-series
- **NIMH Mental Health**: https://www.nimh.nih.gov/health/find-help
- **Psychology Today**: https://www.psychologytoday.com/us/therapists
- **988 Crisis Lifeline**: https://988lifeline.org/

#### ⚠️ MAINTENANCE-PRONE DOMAINS TO AVOID:
- **NCBI/PubMed**: Often shows "planned maintenance" messages that look unprofessional
- **SAMHSA specific helpline pages**: May show 403 Forbidden errors - use 988lifeline.org instead
- **Government research portals**: May have temporary outages during updates
- **Psychology Today archived articles**: Old URLs may return 404 errors - use current pages instead
- **Stanford GSB old insight pages**: May have been restructured - verify links before publishing

#### Link Integration Rules:
1. **Context Required**: Each external link must support a specific claim or statistic
2. **Natural Integration**: Links should flow naturally in sentences, not feel forced
3. **Authoritative Support**: Use links to back up research claims and expert quotes
4. **Diverse Sources**: Don't use the same domain more than twice per article
5. **MANDATORY LINK VERIFICATION**: Before publishing ANY blog post, test EVERY external link to ensure it works and leads to relevant content
6. **Auto-Fix Broken Links**: If a link is broken during creation, immediately replace with a working alternative from the approved domains list
7. **⚠️ CRITICAL: CONTENT RELEVANCE**: Every external link must directly relate to the article's topic. Never use generic domain links (e.g., frontiersin.org/journals/psychology) - always use specific article URLs that match the research claim being made
8. **SPECIFIC ARTICLE LINKS**: Use direct links to research articles, not journal homepages or general domain pages

### 2. Image Requirements (MANDATORY FOR SEO)

#### Image Naming Convention (MANDATORY):
- **File names MUST match alt text exactly**
- **Replace spaces with hyphens (-)**
- **Use descriptive, keyword-rich names**
- **CRITICAL RULE: When adding ANY new image, it MUST be renamed to match its alt text with spaces replaced by hyphens**

Example:
- Alt text: "Introvert overwhelmed by social media sitting alone with multiple screens"
- File name: `introvert-overwhelmed-by-social-media-sitting-alone-with-multiple-screens.jpg`

**IMPORTANT WORKFLOW RULE:**
Every time you add a new image to any blog post:
1. First add the image with its descriptive alt text
2. IMMEDIATELY rename the image file to match the alt text exactly (spaces → hyphens)
3. Update all image src references to use the new filename
4. This ensures SEO optimization and consistent file organization

#### Image Placement:
- **3 strategically placed images minimum per blog post**
- **Main hero image**: At the beginning after introduction
- **Section image**: Middle of article to break up content
- **Resolution image**: Near conclusion showing positive outcome

#### Image Alt Text Requirements:
- Descriptive and keyword-rich
- 10-15 words ideal length
- Include target keywords naturally
- Describe the emotional state and context

### 3. Blog Post Structure (MANDATORY)

#### Header Requirements:
```markdown
---
title: "Main Title: Subtitle with Year (2025)"
slug: "url-friendly-slug"
date: "YYYY-MM-DD"
category: "Category Name"
description: "150-160 character meta description with primary keyword"
canonical: "https://truellyguide.com/blog/slug"
readTime: "X min read"
image: "/images/seo-optimized-filename.jpg"
author: "Marica Šinko"
keywords: ["keyword1", "keyword2", "keyword3", etc.]
---
```

#### Content Structure:
1. **Hook Introduction** (2-3 paragraphs)
   - Statistics or relatable scenario
   - Problem statement
   - Solution preview
   - Include 1-2 external links supporting statistics

2. **Table of Contents** (Required for long-form content)
   - 7-8 main sections
   - Use anchor links (#section-name)

3. **Main Content Sections** (6-8 sections)
   - Each section 200-400 words
   - Include external links supporting claims
   - Use subheadings (H3) for subsections
   - Include practical examples and actionable advice

4. **FAQ Section** (Mandatory)
   - 5-6 common questions
   - Direct, helpful answers
   - Include external links for professional resources

5. **Conclusion with Action Steps**
   - Summary of key points
   - Specific action plan
   - Professional resources with external links

#### Required Components:
- **StyledBlockquote**: For expert quotes and important insights
- **KeyTakeawayBox**: For personal insights and key points
- **StyledList**: For bulleted information and steps
- **Author Bio**: At the end of every post

### 4. SEO Requirements

#### Keyword Integration:
- **Primary keyword**: In title, first paragraph, conclusion
- **Secondary keywords**: Naturally throughout content
- **LSI keywords**: Related terms and synonyms

#### Meta Requirements:
- **Title**: 50-60 characters, include year (2025)
- **Description**: 150-160 characters, compelling and keyword-rich
- **Canonical URL**: Always include
- **Read time**: Calculate and include

### 5. Research and Citations

#### Expert Quotes Requirements:
- Include 2-3 expert quotes per article
- Cite credentials (Dr. Name, Title, Institution)
- Link to credible source when possible

#### Statistical Requirements:
- Include 3-5 relevant statistics
- Always cite source with external link
- Use recent data (2023-2025 preferred)

#### Research Integration:
- Support major claims with external research links
- Use "Research shows...", "Studies indicate...", "According to..."
- Link to original research sources, not secondary reporting

### 6. Content Quality Standards

#### Word Count: 2,500-4,000 words for comprehensive articles
#### Readability: Grade 8-10 reading level
#### Tone: Empathetic, authoritative, actionable
#### Structure: Scannable with headers, lists, and visual breaks

### 7. Technical Requirements

#### React Component Structure:
```javascript
// Required imports
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import StyledBlockquote from '../components/StyledBlockquote';
import KeyTakeawayBox from '../components/KeyTakeawayBox';
import StyledList from '../components/StyledList';
import { sortedBlogPosts } from '../blogData';
import AuthorBio from '../components/AuthorBio';
import Seo from '../components/Seo';
```

#### SEO Component Required:
```javascript
<Seo
  title="Full Title"
  description="Meta description"
  type="article"
  path="/blog/slug"
  article={{
    title: "Article Title",
    authorName: "Marica Šinko",
    datePublished: "YYYY-MM-DD",
    image: "/images/filename.jpg"
  }}
  breadcrumbs={[
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: "Article Title", item: "/blog/slug" }
  ]}
/>
```

### 8. Quality Checklist Before Publishing

#### Content Review:
- [ ] 6-8 credible external links included and verified working
- [ ] 3 images with SEO-optimized filenames matching alt text
- [ ] Expert quotes with proper attribution
- [ ] Statistics cited with external links
- [ ] FAQ section included
- [ ] Action steps in conclusion

#### Technical Review:
- [ ] SEO component properly configured
- [ ] Canonical URL set
- [ ] All components imported and used
- [ ] Image paths correct
- [ ] Internal anchor links working
- [ ] AuthorBio component included

#### SEO Review:
- [ ] Primary keyword in title and first paragraph
- [ ] Meta description 150-160 characters
- [ ] Read time calculated
- [ ] Keywords array populated
- [ ] Image alt text optimized

### 9. Common Mistakes to Avoid

#### External Links:
- ❌ Using generic homepage links (e.g., https://www.harvard.edu/)
- ❌ Linking to broken or 404 pages
- ❌ Using NCBI/PubMed domains (maintenance messages)
- ❌ Using only .com commercial sites
- ✅ Link to specific research articles and studies
- ✅ Use Frontiers in Psychology, Simply Psychology, verified .gov sites
- ✅ Verify all links work before publishing - no maintenance pages!

#### Images:
- ❌ Generic filenames like "image1.jpg"
- ❌ Spaces in filenames
- ❌ Alt text that doesn't match filename
- ✅ Descriptive, keyword-rich filenames with hyphens
- ✅ Alt text matching filename exactly (spaces replaced with hyphens)

#### Content:
- ❌ Making claims without external link citations
- ❌ Using outdated statistics
- ❌ Forgetting FAQ section
- ✅ Every major claim supported by credible external link
- ✅ Recent research and statistics (2023-2025)
- ✅ Comprehensive FAQ addressing common questions

## EXAMPLE EXTERNAL LINK INTEGRATION:

Instead of: "Research shows that introverts process information differently."

Use: "Research from [Frontiers in Psychology](https://www.frontiersin.org/articles/10.3389/fpsyg.2020.590748/full) reveals that introverts process social engagement differently than extroverts, with studies showing that introverts can feel overwhelmed by social interactions and need time alone to recharge."

## FINAL REMINDER:
Every blog post MUST include 6-8 working external links to credible sources (.edu, .gov, research journals, professional organizations). This is critical for SEO performance and Google algorithm ranking. 

**CRITICAL: Always verify links work before publishing - NO MAINTENANCE PAGES!**

Avoid NCBI/PubMed domains as they frequently show unprofessional maintenance messages. Use Frontiers in Psychology, Simply Psychology, and verified .gov sites instead.