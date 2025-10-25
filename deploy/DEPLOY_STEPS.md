Deployment to Vercel: quiet-strength-blog-plbo

Prereqs
- Vercel account access to project: quiet-strength-blog-plbo
- Node.js + npm installed

One-time setup (if needed)
1) Ensure project name in vercel.json is correct: "name": "quiet-strength-blog-plbo"
2) Login and link via Vercel CLI, then deploy

Option A — Quick commands
- npm ci
- npm run build
- npx vercel --prod --confirm --name quiet-strength-blog-plbo

Option B — PowerShell helper
- pwsh -File scripts/deploy-vercel-plbo.ps1
  - Add -SkipLogin if your CLI session is already authenticated

Option C — With token env var
- set VERCEL_TOKEN=YOUR_TOKEN
- npm run build
- npx vercel --prod --confirm --name quiet-strength-blog-plbo --token %VERCEL_TOKEN%

Notes
- Production deployment uses vercel.json for rewrites, redirects, and headers.
- Build step inlines critical CSS via Critters postbuild.
- Ensure custom domains (trueallyguide.com, www.trueallyguide.com) are configured in the Vercel project if desired; non-www should be primary with www→non-www 301.
