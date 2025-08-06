#!/bin/bash

# 🚀 IT Services Vendor Management System - Deployment Script
# This script helps you deploy your application to GitHub, Netlify, and backend hosting

echo "🚀 IT Services Vendor Management System - Deployment Helper"
echo "=========================================================="

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not initialized. Please run 'git init' first."
    exit 1
fi

# Check if we have a remote origin
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  No remote origin found."
    echo "Please add your GitHub repository as remote:"
    echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo ""
    read -p "Do you want to continue with local deployment only? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

echo ""
echo "📋 Deployment Options:"
echo "1. Push to GitHub"
echo "2. Build frontend for Netlify"
echo "3. Build backend for deployment"
echo "4. Full deployment (GitHub + Build)"
echo "5. Exit"
echo ""

read -p "Choose an option (1-5): " choice

case $choice in
    1)
        echo "📤 Pushing to GitHub..."
        if git remote get-url origin > /dev/null 2>&1; then
            git push -u origin main
            echo "✅ Pushed to GitHub successfully!"
        else
            echo "❌ No remote origin configured."
        fi
        ;;
    2)
        echo "🔨 Building frontend for Netlify..."
        cd requisition-ui/frontend
        npm install
        npm run build
        echo "✅ Frontend built successfully!"
        echo "📁 Build output: requisition-ui/frontend/dist"
        echo "🌐 Ready for Netlify deployment!"
        ;;
    3)
        echo "🔨 Building backend for deployment..."
        cd requisition-ui/backend
        npm install
        npx prisma generate
        npm run build
        echo "✅ Backend built successfully!"
        echo "📁 Build output: requisition-ui/backend/dist"
        echo "🚀 Ready for Railway/Render/Vercel deployment!"
        ;;
    4)
        echo "🚀 Full deployment process..."
        
        # Push to GitHub
        if git remote get-url origin > /dev/null 2>&1; then
            echo "📤 Pushing to GitHub..."
            git push -u origin main
            echo "✅ Pushed to GitHub successfully!"
        else
            echo "⚠️  No remote origin configured. Skipping GitHub push."
        fi
        
        # Build frontend
        echo "🔨 Building frontend..."
        cd requisition-ui/frontend
        npm install
        npm run build
        echo "✅ Frontend built successfully!"
        
        # Build backend
        echo "🔨 Building backend..."
        cd ../backend
        npm install
        npx prisma generate
        npm run build
        echo "✅ Backend built successfully!"
        
        echo ""
        echo "🎉 Full deployment completed!"
        echo "📁 Frontend build: requisition-ui/frontend/dist"
        echo "📁 Backend build: requisition-ui/backend/dist"
        echo ""
        echo "🌐 Next steps:"
        echo "1. Deploy frontend to Netlify"
        echo "2. Deploy backend to Railway/Render/Vercel"
        echo "3. Set up environment variables"
        echo "4. Test your deployment"
        ;;
    5)
        echo "👋 Goodbye!"
        exit 0
        ;;
    *)
        echo "❌ Invalid option. Please choose 1-5."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed deployment instructions, see DEPLOYMENT.md"
echo "🔗 Quick links:"
echo "   - Netlify: https://netlify.com"
echo "   - Railway: https://railway.app"
echo "   - Render: https://render.com"
echo "   - Vercel: https://vercel.com" 