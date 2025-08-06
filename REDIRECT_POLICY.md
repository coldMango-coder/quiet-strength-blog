# Redirect Policy Documentation

## Canonical URL Rules

The canonical domain for trueallyguide.com is **non-www**:
- ✅ `https://trueallyguide.com`
- ❌ `https://www.trueallyguide.com`

### URL Structure
- **Protocol:** HTTPS only
- **Domain:** trueallyguide.com (non-www) 
- **Trailing slash:** OFF (no trailing slashes)
- **Category URLs:** Clean slugs without encoded characters

## Category URL Mapping

| Display Name | Clean Slug |
|---|---|
| Introversion & Personality | introversion-and-personality |
| Relationships & Dating | relationships-and-dating |
| Career & Workplace | career-and-workplace |
| Self-Development | self-development |
| Women's Wellness | womens-wellness |

## Redirect Implementation

### Current Issue
Vercel's automatic domain redirects are overriding the vercel.json redirect configuration, causing:
- `https://trueallyguide.com/` → `https://www.trueallyguide.com/` (308)

### Vercel Configuration (vercel.json)
```json
"redirects": [
  {
    "source": "/(.*)",
    "has": [
      {
        "type": "host", 
        "value": "www.trueallyguide.com"
      }
    ],
    "destination": "https://trueallyguide.com/$1",
    "permanent": true
  }
]
```

### Domain-Level Fix Required
To properly implement non-www redirects on Vercel:

1. **Vercel Dashboard** → Project Settings → Domains
2. Set `trueallyguide.com` as primary domain
3. Set `www.trueallyguide.com` to redirect to primary domain
4. Ensure "Redirect to Primary Domain" is enabled

### Alternative Solutions
If domain-level settings can't be changed:

1. **Accept www as canonical** - Update all code to use www URLs
2. **DNS-level redirect** - Configure DNS provider to handle www→non-www
3. **Edge middleware** - Use Vercel Edge Functions for custom redirect logic

## Testing

Run redirect tests:
```bash
npm run redirects:test
```

All URLs should:
- Return 200 OK directly (canonical URLs)
- Have single 301/308 redirect (non-canonical URLs) 
- Never have multiple redirect hops

## Files Updated

### Components with Category Links
- `src/components/Header.js` - Navigation dropdowns
- `src/components/Themes.js` - "Explore More" links  
- `src/pages/BlogListPage.js` - Category filter URLs
- `src/pages/CategoryPage.js` - Category routing

### Configuration
- `vercel.json` - Redirect rules and category redirects
- `scripts/generate-sitemap-dynamic.js` - Clean category URLs in sitemap
- `src/blogData.js` - Category slug mapping

### SEO
- All pages use `src/components/Seo.js` for canonical tags
- Sitemap contains only canonical URLs with clean category slugs
- No duplicate canonical tags