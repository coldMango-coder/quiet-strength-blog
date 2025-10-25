Param(
  [string]$ProjectName = 'quiet-strength-blog-plbo',
  [switch]$SkipLogin
)

function Fail($msg) { Write-Host $msg -ForegroundColor Red; exit 1 }

Write-Host "Deploying to Vercel project: $ProjectName" -ForegroundColor Cyan

if (-not (Get-Command node -ErrorAction SilentlyContinue)) { Fail "Node.js not found on PATH" }
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) { Fail "npm not found on PATH" }

if (-not (Get-Command vercel -ErrorAction SilentlyContinue)) {
  Write-Host "Installing Vercel CLI globally..." -ForegroundColor Yellow
  npm i -g vercel | Out-Null
  if ($LASTEXITCODE -ne 0) { Fail "Failed to install Vercel CLI" }
}

if (-not $SkipLogin) {
  Write-Host "Logging into Vercel (interactive)..." -ForegroundColor Yellow
  vercel login
  if ($LASTEXITCODE -ne 0) { Fail "Vercel login failed" }
}

Write-Host "Linking to project '$ProjectName'..." -ForegroundColor Yellow
vercel link --project $ProjectName --confirm
if ($LASTEXITCODE -ne 0) { Fail "Vercel link failed" }

Write-Host "Building production bundle..." -ForegroundColor Yellow
npm run build
if ($LASTEXITCODE -ne 0) { Fail "Build failed" }

Write-Host "Deploying to PRODUCTION..." -ForegroundColor Cyan
vercel --prod --confirm --name $ProjectName
if ($LASTEXITCODE -ne 0) { Fail "Vercel deployment failed" }

Write-Host "✔ Deployment triggered successfully." -ForegroundColor Green

