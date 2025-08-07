# Quiet Strength Blog

**Latest Update (Aug 7, 2025)**: Static page generation with server-side canonical tags implemented!

A React-based blog focused on helping introverted women build confidence, prevent burnout, and thrive on their own terms.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build

# Run prerendering
npm run prerender
```

## 📁 Project Structure

```
src/
├── components/          # Reusable React components
│   ├── SEO.js          # Dynamic SEO component with canonical tags
│   ├── NormalizedLink.js # Auto-normalizing internal links
│   └── __tests__/      # Component tests
├── lib/
│   └── seo/            # SEO utilities
│       ├── getCanonicalUrl.js    # Canonical URL generation
│       └── normalizeHref.js      # Link normalization
├── pages/              # Page components
├── styles/             # CSS and styling
└── App.js             # Main app component

scripts/
├── build.js           # Custom build script
├── prerender.mjs      # Static prerendering for SEO
└── generate-sitemap-dynamic.js

tests/
├── canonical-urls.spec.js  # E2E canonical URL tests
├── prerender.spec.js       # Prerender validation tests
└── *.spec.js               # Other test files
```

## 🔍 SEO Features

### Static Prerendering for SEO

This project uses static prerendering to ensure search engines see the correct canonical tags and meta data without requiring JavaScript execution.

#### How Prerendering Works

1. **Build Step**: `npm run build` now automatically runs prerendering after the standard build
2. **Route Discovery**: Reads `public/sitemap.xml` to find all routes to prerender
3. **Static Generation**: Uses Puppeteer to visit each route and capture fully-rendered HTML
4. **Output**: Creates `build/[route]/index.html` files with correct SEO tags

#### Canonical URL Strategy

- **Dynamic Detection**: SEO component uses `useLocation()` hook to auto-detect current path
- **Consistent Format**: All URLs normalized to canonical format (no trailing slashes except root)
- **Link Normalization**: `NormalizedLink` component automatically fixes internal links
- **Server-Side Ready**: Prerendered HTML contains correct canonical tags for Googlebot

### SEO Components

#### `getCanonicalUrl(path)`
Pure function that generates consistent canonical URLs:
```javascript
getCanonicalUrl('/blog/my-post') // → 'https://trueallyguide.com/blog/my-post'
getCanonicalUrl('/') // → 'https://trueallyguide.com/'
```

#### `normalizeHref(href)`
Normalizes internal links to canonical format:
- Converts http → https
- Removes www subdomain
- Removes trailing slashes (except root)
- Lowercases paths

#### `<NormalizedLink>`
Drop-in replacement for standard links that automatically normalizes internal URLs:
```jsx
<NormalizedLink href="/blog/my-post/">My Post</NormalizedLink>
// Renders with href="/blog/my-post" (no trailing slash)
```

## 🧪 Testing

### Unit Tests
```bash
npm test                    # Run all tests
npm test src/lib/seo        # Test SEO utilities only
```

### E2E Testing
```bash
npm run test:e2e                  # All Playwright tests
npm run test:url-canonicals      # Canonical URL validation
npm run test:prerender           # Prerendered content validation
```

### Prerender Validation
The prerender tests validate that:
- Each route has exactly one canonical tag in server-rendered HTML
- Canonical URLs match the expected format without JavaScript
- Essential SEO meta tags are present in static HTML
- No trailing slashes (except root) in canonical tags

## 📊 Build & Deployment

### Build Commands
```bash
npm run build              # Full build with prerendering
npm run build:no-prerender # Build without prerendering (faster for development)
npm run prerender          # Run prerendering only
```

### Vercel Configuration
The project includes optimized `vercel.json` configuration:
- Routes prerendered HTML files first, falls back to SPA
- Proper caching headers for static assets
- Security headers and redirects

### Asset Validation
```bash
npm run ci:validate-assets  # Validate all assets are accessible
```

## 🔧 Development

### Link Policy
- **Internal Links**: Always use `NormalizedLink` component or ensure canonical format
- **External Links**: Use standard `<a>` tags with `rel="noopener noreferrer"`
- **Canonical URLs**: Generated automatically, no manual path props needed

### SEO Best Practices
1. Every page automatically gets correct canonical tag via `useLocation()`
2. Internal links normalized to prevent redirects
3. Prerendered HTML ensures search engines see complete content
4. Sitemap.xml automatically generated with canonical URLs

## 📈 Performance

### Bundle Analysis
```bash
npm run analyze  # Opens webpack-bundle-analyzer
```

### Optimization Features
- Code splitting with React lazy loading
- Optimized images with WebP/AVIF formats
- Static asset caching
- Prerendered critical SEO content

## 🎯 SEO Validation

After deployment, validate the implementation:

1. **View Source Test**: Check 5 sample routes show correct canonical in raw HTML
2. **Crawl Test**: Run `npm run test:prerender` to validate without JavaScript  
3. **Search Console**: Verify "Page with redirect" errors are eliminated
4. **Lighthouse**: Confirm canonical warnings are resolved

### Manual Validation Commands
```bash
# Test canonical tags in raw HTML (no JS)
curl -s https://trueallyguide.com/blog/my-post | grep canonical

# Validate prerendered content
npm run test:prerender
```

## 🔄 Continuous Integration

The project includes comprehensive CI validation:
- **Unit Tests**: All SEO utilities and components
- **E2E Tests**: Canonical URLs and prerendered content  
- **Asset Tests**: 100% asset accessibility validation
- **Build Tests**: Successful prerendering of all routes

---

Built with ❤️ for introverted women seeking to build quiet confidence.