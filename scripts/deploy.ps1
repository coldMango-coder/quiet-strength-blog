Param(
  [switch]$UseVercelCLI
)

function Fail($msg) {
  Write-Host "❌ $msg" -ForegroundColor Red
  exit 1
}

Write-Host "🚀 Deploying quiet-strength-blog (images optimized)" -ForegroundColor Cyan

# Ensure required tools
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { Fail "git is not installed or not on PATH" }
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail "Node.js is not installed or not on PATH" }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Fail "npm is not installed or not on PATH" }

# Show current repo/branch
git status
$branch = (git rev-parse --abbrev-ref HEAD).Trim()
Write-Host "📦 Current branch: $branch"

# 1) Push feature branch to GitHub
Write-Host "📤 Pushing branch to GitHub..." -ForegroundColor Yellow
git push -u origin $branch
if ($LASTEXITCODE -ne 0) { Fail "Failed to push branch $branch. Ensure GitHub auth is configured." }

# 2) If using Vercel CLI route, deploy directly to production
if ($UseVercelCLI) {
  if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
    Write-Host "📦 Installing Vercel CLI globally..."
    npm i -g vercel
    if ($LASTEXITCODE -ne 0) { Fail "Failed to install Vercel CLI" }
  }

  Write-Host "🔐 Logging into Vercel (if needed)..."
  vercel login
  if ($LASTEXITCODE -ne 0) { Fail "Vercel login failed" }

  Write-Host "🔗 Linking to project 'quiet-strength-blog-new' (mango's projects)..." -ForegroundColor Yellow
  vercel link --confirm
  if ($LASTEXITCODE -ne 0) { Fail "Vercel link failed" }

  Write-Host "🚀 Deploying to PRODUCTION via Vercel CLI..." -ForegroundColor Cyan
  vercel --prod --confirm
  if ($LASTEXITCODE -ne 0) { Fail "Vercel production deploy failed" }

  Write-Host "🎉 Deployed via Vercel CLI." -ForegroundColor Green
  exit 0
}

# 3) GitHub → merge to main to trigger Vercel production deploy
Write-Host "🌿 Switching to main and merging $branch..." -ForegroundColor Yellow
git checkout main
if ($LASTEXITCODE -ne 0) { Fail "Failed to checkout main" }

git pull origin main --ff-only
if ($LASTEXITCODE -ne 0) { Fail "Failed to pull latest main (non-FF). Merge/rebase may be required." }

git merge --no-ff $branch -m "Merge: Optimize images + update references + lazy loading + dev script fix"
if ($LASTEXITCODE -ne 0) { Fail "Merge failed. Resolve conflicts or open a PR from $branch to main." }

Write-Host "📤 Pushing main (production)..." -ForegroundColor Yellow
git push origin main
if ($LASTEXITCODE -ne 0) { Fail "Failed to push main. Check permissions or network." }

Write-Host "⏳ Waiting briefly for Vercel to start deployment..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

Write-Host "🎉 Pushed to main. Vercel will auto-deploy to production. Check your dashboard: https://vercel.com/dashboard" -ForegroundColor Green
Write-Host "🔗 Project: quiet-strength-blog-new (mango's projects)"
Write-Host "🌍 Domains: trueallyguide.com, www.trueallyguide.com, https://quiet-strength-blog-new.vercel.app/"

