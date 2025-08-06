# 🚀 Deployment Guide

This guide will help you deploy your IT Services Vendor Management System to GitHub, Netlify (frontend), and a backend hosting service.

## 📋 Prerequisites

- GitHub account
- Netlify account (free tier available)
- Railway/Render/Vercel account for backend
- Gemini API key
- PostgreSQL database

## 🔧 Step 1: Prepare Your Repository

### 1.1 Initialize Git Repository

```bash
# Navigate to your project root
cd /Users/amitgogna/git-practice

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: IT Services Vendor Management System"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git push -u origin main
```

### 1.2 Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it: `it-services-vendor-management`
4. Make it public or private
5. Don't initialize with README (we already have one)
6. Click "Create repository"

## 🌐 Step 2: Deploy Frontend to Netlify

### 2.1 Build Frontend Locally

```bash
cd requisition-ui/frontend

# Install dependencies
npm install

# Build for production
npm run build
```

### 2.2 Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New site from Git"**
4. **Choose GitHub** and select your repository
5. **Configure build settings:**
   - Build command: `cd requisition-ui/frontend && npm install && npm run build`
   - Publish directory: `requisition-ui/frontend/dist`
6. **Click "Deploy site"**

### 2.3 Configure Environment Variables

1. Go to your Netlify site dashboard
2. Navigate to **Site settings** → **Environment variables**
3. Add:
   ```
   VITE_API_URL=https://your-backend-url.com
   ```

## 🔧 Step 3: Deploy Backend

### Option A: Railway (Recommended)

1. **Go to [Railway](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**
5. **Configure environment variables:**
   ```
   DATABASE_URL=your-postgresql-url
   GEMINI_API_KEY=your-gemini-api-key
   PORT=3000
   ```
6. **Deploy**

### Option B: Render

1. **Go to [Render](https://render.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New"** → **"Web Service"**
4. **Connect your GitHub repository**
5. **Configure:**
   - Name: `it-services-vendor-backend`
   - Root Directory: `requisition-ui/backend`
   - Build Command: `npm install && npx prisma generate && npm run build`
   - Start Command: `npm run start:prod`
6. **Add environment variables** (same as Railway)
7. **Deploy**

### Option C: Vercel

1. **Go to [Vercel](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**
5. **Configure:**
   - Framework Preset: `Node.js`
   - Root Directory: `requisition-ui/backend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Add environment variables**
7. **Deploy**

## 🗄️ Step 4: Set Up Database

### Option A: Railway PostgreSQL

1. In your Railway project, click **"New"** → **"Database"**
2. Select **PostgreSQL**
3. Copy the connection URL
4. Add it as `DATABASE_URL` environment variable

### Option B: Supabase (Free Tier)

1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Go to **Settings** → **Database**
4. Copy the connection string
5. Add it as `DATABASE_URL`

### Option C: Neon (Free Tier)

1. Go to [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add it as `DATABASE_URL`

## 🔄 Step 5: Update Frontend API URL

After your backend is deployed:

1. **Get your backend URL** (e.g., `https://your-app.railway.app`)
2. **Update Netlify environment variable:**
   ```
   VITE_API_URL=https://your-backend-url.com
   ```
3. **Trigger a new deployment** in Netlify

## 🧪 Step 6: Test Your Deployment

### Test Backend

```bash
# Test the seed endpoint
curl -X POST https://your-backend-url.com/seed

# Test the AI chat
curl -X POST https://your-backend-url.com/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"Show me all vendors"}'
```

### Test Frontend

1. Visit your Netlify URL
2. Try the AI chat interface
3. Check the dashboard
4. Verify all features work

## 🔧 Environment Variables Summary

### Backend (.env)
```env
DATABASE_URL="postgresql://..."
GEMINI_API_KEY="your-gemini-api-key"
PORT=3000
```

### Frontend (Netlify)
```env
VITE_API_URL="https://your-backend-url.com"
```

## 🚀 Final URLs

- **Frontend**: `https://your-app.netlify.app`
- **Backend**: `https://your-app.railway.app` (or your chosen platform)
- **GitHub**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

## 🔍 Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your backend allows requests from your Netlify domain
2. **Database Connection**: Verify your `DATABASE_URL` is correct
3. **Build Failures**: Check that all dependencies are in `package.json`
4. **Environment Variables**: Ensure all required variables are set

### Debug Commands

```bash
# Check backend logs
railway logs

# Check frontend build
netlify build:debug

# Test API locally
curl -X POST http://localhost:3000/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"test"}'
```

## 📈 Next Steps

1. **Set up custom domain** (optional)
2. **Configure CI/CD** for automatic deployments
3. **Add monitoring** and error tracking
4. **Set up SSL certificates** (usually automatic)
5. **Configure backups** for your database

## 🎉 Congratulations!

Your IT Services Vendor Management System is now live and accessible worldwide! 