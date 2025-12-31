# Rupiya Deployment Script (PowerShell)
# This script helps deploy the Rupiya app to Vercel

Write-Host "🚀 Rupiya Deployment Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

# Check if Vercel CLI is installed
Write-Host "📋 Checking Vercel CLI..." -ForegroundColor Cyan
$vercelCheck = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelCheck) {
    Write-Host "❌ Vercel CLI not found. Installing..." -ForegroundColor Red
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install Vercel CLI" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Vercel CLI found" -ForegroundColor Green
Write-Host ""

# Check if git is clean
Write-Host "📋 Checking git status..." -ForegroundColor Cyan
$gitStatus = git status --porcelain

if ($gitStatus) {
    Write-Host "⚠️  Warning: You have uncommitted changes" -ForegroundColor Yellow
    $response = Read-Host "Continue anyway? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "❌ Deployment cancelled" -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ Git status OK" -ForegroundColor Green
Write-Host ""

# Build locally first
Write-Host "🔨 Building locally..." -ForegroundColor Cyan
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed. Please fix errors and try again." -ForegroundColor Red
    exit 1
}

Write-Host "✅ Build successful" -ForegroundColor Green
Write-Host ""

# Deploy to Vercel
Write-Host "📤 Deploying to Vercel..." -ForegroundColor Cyan
vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📊 Next steps:" -ForegroundColor Cyan
    Write-Host "1. Visit your Vercel dashboard to verify deployment"
    Write-Host "2. Check that your domain is configured correctly"
    Write-Host "3. Test the application at your domain"
    Write-Host "4. Monitor performance in Vercel Analytics"
} else {
    Write-Host "❌ Deployment failed. Check the error above." -ForegroundColor Red
    exit 1
}
