# BLOG STRUCTURE REQUIREMENTS - CRITICAL IMPLEMENTATION GUIDE

## 🚨 VERY IMPORTANT - MANDATORY REQUIREMENTS FOR ALL BLOG POSTS

This document contains **CRITICAL REQUIREMENTS** that MUST be followed for every blog post creation. These are non-negotiable standards that ensure consistency, SEO optimization, and proper functionality.

---

## 1. EXTERNAL LINKS - MANDATORY REQUIREMENT ⚠️

### **CRITICAL RULE: ALL EXTERNAL LINKS MUST BE VERIFIED AND WORKING**

**BEFORE adding any external link, you MUST:**
1. Verify the URL actually works and leads to the correct page
2. Use specific, targeted URLs rather than generic domain links
3. Test each link to ensure it doesn't return 404 or access denied errors

### **Approved High-Authority Sources:**
- **NCBI/PubMed**: Use specific article URLs like `https://www.ncbi.nlm.nih.gov/pmc/articles/PMC[ID]/`
- **Journal of Social and Personal Relationships**: `https://journals.sagepub.com/home/spr`
- **Frontiers in Psychology**: `https://www.frontiersin.org/journals/psychology`
- **American Psychological Association**: `https://www.apa.org/` (verify specific pages work)
- **Harvard Business Review**: `https://hbr.org/`
- **Psychology Today**: `https://www.psychologytoday.com/`
- **National Institute of Mental Health**: `https://www.nimh.nih.gov/`
- **Sleep Foundation**: `https://www.sleepfoundation.org/`
- **CDC**: `https://www.cdc.gov/`

### **Link Format Requirements:**
```jsx
<a href="VERIFIED_URL" target="_blank" rel="noopener noreferrer" className="text-brand-emphasis hover:underline">
  Link Text
</a>
```

---

## 2. IMAGE NAMING CONVENTION - MANDATORY REQUIREMENT ⚠️

### **CRITICAL RULE: Image filenames MUST match their alt text exactly**

**Process:**
1. Write the alt text for the image first
2. Convert alt text to filename by replacing spaces with hyphens (-)
3. Use lowercase letters only
4. Remove special characters except hyphens
5. Add appropriate file extension (.jpg, .png, etc.)

**Example:**
- Alt text: `"Confident woman journaling about emotional growth in coffee shop"`
- Filename: `confident-woman-journaling-about-emotional-growth-in-coffee-shop.jpg`

**Implementation:**
```jsx
<img 
  src="/images/confident-woman-journaling-about-emotional-growth-in-coffee-shop.jpg" 
  alt="Confident woman journaling about emotional growth in coffee shop" 
  className="rounded-lg shadow-md my-8 w-full" 
  loading="lazy"
  width="600"
  height="400"
/>
```

---

## 3. BLOG POST STRUCTURE - MANDATORY TEMPLATE

### **File Structure:**
```
src/pages/BlogPost[TopicName].js
```

### **Required Imports:**
```jsx
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

### **Required Sections:**
1. **SEO and Metadata**
2. **Table of Contents** (in white card with shadow)
3. **Introduction** (with first image placement)
4. **Main Content Sections** (with strategic image placements)
5. **FAQ Section** (with modern design - see section 4)
6. **Conclusion/Action Steps**
7. **Disclaimer**
8. **AuthorBio Component**

---

## 4. FAQ SECTION - MODERN DESIGN REQUIREMENTS ⚠️

### **REPLACE OLD WHITE CARDS WITH MODERN ACCORDION DESIGN**

**Old Design (DO NOT USE):**
```jsx
<div className="bg-white p-6 rounded-lg shadow-md">
  <h3>Question</h3>
  <p>Answer</p>
</div>
```

**New Modern Design (MANDATORY):**
```jsx
<div className="bg-gradient-to-r from-brand-light to-white border-l-4 border-brand-emphasis p-6 rounded-r-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
  <h3 className="text-xl font-bold text-brand-dark mb-4 flex items-center">
    <span className="bg-brand-emphasis text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-3">
      Q
    </span>
    Question Title
  </h3>
  <div className="ml-11">
    <p className="text-brand-primary leading-relaxed">
      Answer content here...
    </p>
  </div>
</div>
```

---

## 5. BLOG DATA REQUIREMENTS

### **blogData.js Entry Format:**
```javascript
{
  slug: 'descriptive-url-slug',
  title: 'Full Article Title with Year',
  description: 'SEO-optimized meta description under 160 characters',
  date: 'YYYY-MM-DD',
  category: categories.APPROPRIATE_CATEGORY,
  component: BlogPostComponentName,
  image: '/images/image-filename-matching-alt-text.jpg',
  readTime: 'X min read',
}
```

---

## 6. SEO REQUIREMENTS

### **Mandatory SEO Elements:**
1. **Canonical URL**
2. **Meta Description** (under 160 characters)
3. **Article Schema** with author, date, image
4. **Breadcrumb Schema**
5. **Image Alt Text** (descriptive and SEO-friendly)
6. **Proper Heading Structure** (H1 > H2 > H3)

---

## 7. CONTENT REQUIREMENTS

### **Mandatory Content Elements:**
1. **Reading Time** (8-15 minutes typical)
2. **Table of Contents** with anchor links
3. **Author Bio** at the end
4. **Disclaimer** section
5. **External Links** to authoritative sources
6. **Strategic Image Placement** (3-4 images per article)
7. **Styled Components** (StyledList, KeyTakeawayBox, StyledBlockquote)

---

## 8. TECHNICAL REQUIREMENTS

### **Performance Requirements:**
1. **Lazy Loading** for all images
2. **Proper Image Dimensions** (width/height attributes)
3. **Responsive Design** (mobile-first)
4. **Fast Loading** (optimized images)

### **Accessibility Requirements:**
1. **Alt Text** for all images
2. **Proper Heading Hierarchy**
3. **Focus Management**
4. **Color Contrast** compliance

---

## 9. DEPLOYMENT CHECKLIST

### **Before Pushing to GitHub:**
- ✅ All external links tested and working
- ✅ Images renamed to match alt text
- ✅ FAQ section uses modern design
- ✅ Blog added to blogData.js correctly
- ✅ SEO components properly configured
- ✅ No console errors
- ✅ Responsive design tested

---

## 🚨 CRITICAL REMINDER

**These requirements are MANDATORY for every blog post. Failure to follow these standards will result in:**
- Broken links and poor user experience
- SEO penalties
- Inconsistent design
- Failed deployments

**Always refer to this document when creating new blog posts!**