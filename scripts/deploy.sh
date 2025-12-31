#!/bin/bash

# Rupiya Deployment Script
# This script helps deploy the Rupiya app to Vercel

set -e

echo "🚀 Rupiya Deployment Script"
echo "================================"
echo ""

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if git is clean
echo "📋 Checking git status..."
if ! git diff-index --quiet HEAD --; then
    echo "⚠️  Warning: You have uncommitted changes"
    read -p "Continue anyway? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Deployment cancelled"
        exit 1
    fi
fi

# Build locally first
echo ""
echo "🔨 Building locally..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

echo "✅ Build successful"
echo ""

# Deploy to Vercel
echo "📤 Deploying to Vercel..."
vercel --prod

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "📊 Next steps:"
    echo "1. Visit your Vercel dashboard to verify deployment"
    echo "2. Check that your domain is configured correctly"
    echo "3. Test the application at your domain"
    echo "4. Monitor performance in Vercel Analytics"
else
    echo "❌ Deployment failed. Check the error above."
    exit 1
fi
