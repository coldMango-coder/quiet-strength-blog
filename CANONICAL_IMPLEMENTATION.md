# Canonical URL Implementation

This project implements a comprehensive canonical URL system that ensures `<link rel="canonical">` tags are present in **both development and production environments**.

## 🎯 Problem Solved

**Issue**: In development, canonical tags only appeared after React hydration, not in view-source.
**Solution**: Multi-layered canonical system with server-side injection for both dev and production.

## 🏗️ Architecture

### Production (SSR/SSG) ✅
- **File**: `scripts/generate-static-pages.js`
- **Method**: Server-side static generation
- **Result**: Canonicals baked into HTML at build time
- **Example**: `<link rel="canonical" href="https://trueallyguide.com/blog/post" />`

### Development (Dev Middleware) ✅
- **File**: `dev-server.js`
- **Method**: Express middleware with canonical injection
- **Result**: Canonicals present in view-source during development
- **Example**: `<link rel="canonical" href="http://localhost:3002/blog/post" />`

### Client Fallback (Dev Safety Net) ✅
- **File**: `src/hooks/useDevCanonicalFallback.js`
- **Method**: React hook for development-only fallback
- **Result**: Ensures canonicals exist if middleware fails
- **Guard**: Only runs in `NODE_ENV !== 'production'`

## 🚀 Usage

### Development with Canonical Tags
```bash
npm run dev:canonical    # Start dev server with canonical injection
```

### Standard Development (React dev server)
```bash
npm start               # Standard React dev server (canonicals via React Helmet)
```

### Production Build
```bash
npm run build           # Build with SSG canonicals
```

### Validation
```bash
npm run validate:canonicals:dev    # Validate both dev and production canonicals
```

## 🔧 How It Works

### 1. Development Middleware (`dev-server.js`)

```javascript
// Middleware injects canonicals server-side
app.use((req, res, next) => {
  const cleanPath = req.originalUrl.split('?')[0];
  const canonicalUrl = `http://localhost:3002${cleanPath}`;
  const metaInjection = `<link rel="canonical" href="${canonicalUrl}" />`;
  html = html.replace('</head>', `${metaInjection}\n</head>`);
  res.send(html);
});
```

### 2. Production SSG (`scripts/generate-static-pages.js`)

```javascript
// Generates HTML with baked-in canonicals
function generateHTMLWithCanonical(url, title, description) {
  const canonicalUrl = url;
  return `<link rel="canonical" href="${canonicalUrl}" />`;
}
```

### 3. Client Fallback Hook (`useDevCanonicalFallback.js`)

```javascript
export function useDevCanonicalFallback() {
  // Only runs in development
  if (process.env.NODE_ENV === 'production') return;
  
  // Adds canonical if missing
  if (!document.querySelector('link[rel="canonical"]')) {
    // Create canonical element
  }
}
```

## ✅ Validation Results

- **Development**: ✅ All routes have canonicals in view-source
- **Production**: ✅ All static files have correct canonicals  
- **No Duplicates**: ✅ Only one canonical per page
- **Environment Isolation**: ✅ Dev fallback doesn't run in production

## 📋 NPM Scripts

| Script | Purpose | Environment |
|--------|---------|-------------|
| `dev:canonical` | Dev server with canonical injection | Development |
| `start` | Standard React dev server | Development |
| `build` | Production build with SSG canonicals | Production |
| `validate:canonicals:dev` | Validate canonicals in both environments | Both |
| `seo:validate` | Full SEO validation including canonicals | Production |

## 🛡️ Safety Features

1. **Environment Guards**: Dev-only code has `NODE_ENV` checks
2. **Error Handling**: Middleware has try-catch blocks
3. **Fallback Chain**: Multiple layers ensure canonicals always exist
4. **No Production Impact**: Dev middleware never runs in production builds

## 🔍 Testing

The implementation includes comprehensive validation:

```bash
# Test development server
curl -s "http://localhost:3002/" | grep canonical

# Validate all environments  
npm run validate:canonicals:dev
```

## 📁 File Structure

```
├── dev-server.js                     # Dev middleware with canonical injection
├── validate-canonicals-dev.js        # Validation script
├── scripts/generate-static-pages.js  # Production SSG canonicals
├── src/hooks/useDevCanonicalFallback.js  # Client dev fallback
├── src/components/Seo.js             # React Helmet canonicals
└── package.json                      # NPM scripts
```

## 🎉 Benefits

1. **Perfect SEO**: Canonicals visible in view-source in all environments
2. **Developer Experience**: Easy dev server with real canonical behavior  
3. **Production Optimized**: No client-side dependency for canonicals
4. **Zero Duplicates**: Smart guards prevent multiple canonical tags
5. **Maintainable**: Clean separation between dev and production logic

## 🔄 Migration Notes

- Existing production SSG system unchanged
- New dev server provides better local testing
- Client fallback ensures backward compatibility
- No breaking changes to existing workflows