# Deployment Guide - Car Comparison Website

This guide will walk you through deploying your car comparison website to production using Vercel (frontend) and Render (backend).

## Architecture Overview

- **Frontend**: React + Vite + TypeScript hosted on Vercel
- **Backend**: Node.js + Express API hosted on Render
- **Database**: Currently using in-memory data (can be upgraded to real database)

---

## Prerequisites

Before deploying, make sure you have:

1. A GitHub account with your repository pushed
2. A Vercel account (sign up at https://vercel.com)
3. A Render account (sign up at https://render.com)
4. Git installed and repository committed

---

## Part 1: Backend Deployment (Render)

### Step 1: Push Your Code to GitHub

```powershell
# Navigate to your project
cd c:\Users\yunus\Desktop\CarComparison

# Initialize git if not already done
git init
git add .
git commit -m "Prepare for deployment"

# Push to GitHub
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### Step 2: Create Render Web Service

1. Go to https://render.com/dashboard
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `car-compare-api` (or your preferred name)
   - **Region**: Choose closest to your users
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Instance Type**: `Free` (or paid for better performance)

### Step 3: Configure Environment Variables

In the Render dashboard, add these environment variables:

| Key | Value | Description |
|-----|-------|-------------|
| `PORT` | `10000` | Render's default port |
| `NODE_ENV` | `production` | Production mode |
| `FRONTEND_URL` | `https://your-app.vercel.app` | Your Vercel domain (add after frontend deployment) |
| `CORS_ORIGIN` | `https://your-app.vercel.app` | Same as FRONTEND_URL |
| `CACHE_TTL_MINUTES` | `10` | Cache duration in minutes |
| `CACHE_TTL_SECONDS` | `600` | Cache duration in seconds |

**Note**: You'll update `FRONTEND_URL` after deploying the frontend.

### Step 4: Deploy Backend

1. Click **"Create Web Service"**
2. Wait for the build to complete (2-5 minutes)
3. Once deployed, you'll get a URL like: `https://car-compare-api.onrender.com`
4. Test the API by visiting: `https://car-compare-api.onrender.com/api/countries`

**Important**: Copy your Render URL - you'll need it for frontend configuration.

---

## Part 2: Frontend Deployment (Vercel)

### Step 1: Create Vercel Project

1. Go to https://vercel.com/dashboard
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Vite project

### Step 2: Configure Build Settings

Vercel should automatically configure:
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

If not, set these manually.

### Step 3: Configure Environment Variables

Add this environment variable in Vercel:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://car-compare-api.onrender.com/api` |

Replace `car-compare-api.onrender.com` with your actual Render URL from Part 1.

### Step 4: Deploy Frontend

1. Click **"Deploy"**
2. Wait for the build to complete (1-3 minutes)
3. You'll get a URL like: `https://your-app.vercel.app`

### Step 5: Update Backend CORS Settings

1. Go back to your Render dashboard
2. Find your backend service
3. Update these environment variables:
   - `FRONTEND_URL`: `https://your-app.vercel.app`
   - `CORS_ORIGIN`: `https://your-app.vercel.app`
4. Click **"Save Changes"** (this will redeploy the backend)

---

## Part 3: Verification

### Test Your Deployed Application

1. Visit your Vercel URL: `https://your-app.vercel.app`
2. Try searching for a car (e.g., "Toyota Camry")
3. Verify the comparison table loads with data
4. Click on a country row to see the country panel
5. Check currency conversion works
6. Verify all recommendations load

### Common Issues and Solutions

#### Issue 1: CORS Error
**Symptom**: Browser console shows "CORS policy" error

**Solution**:
- Verify `FRONTEND_URL` in Render matches your Vercel domain exactly
- Make sure to include `https://` in the URL
- Redeploy backend after changing CORS settings

#### Issue 2: API Connection Failed
**Symptom**: "Unable to connect to backend" message

**Solution**:
- Check `VITE_API_URL` in Vercel environment variables
- Verify Render backend is running (green "Live" status)
- Test backend directly: `https://your-backend.onrender.com/api/countries`

#### Issue 3: Build Failed on Vercel
**Symptom**: Vercel build fails with TypeScript errors

**Solution**:
```powershell
# Locally test the build
npm run build

# Fix any TypeScript errors
# Then commit and push
git add .
git commit -m "Fix build errors"
git push
```

#### Issue 4: Backend Sleeping (Render Free Tier)
**Symptom**: First API request takes 30+ seconds

**Solution**: This is normal on Render's free tier. The backend "sleeps" after 15 minutes of inactivity.
- Upgrade to a paid plan for always-on service
- Or accept the cold start delay

---

## Part 4: Local Development with Both Servers

### Run Backend and Frontend Simultaneously

Instead of running two separate terminals:

```powershell
# Run both servers at once
npm run dev:all
```

This will start:
- Backend on `http://localhost:5001`
- Frontend on `http://localhost:8080`

### Individual Commands

```powershell
# Frontend only
npm run dev

# Backend only
npm run dev:backend

# Both servers
npm run dev:all
```

---

## Part 5: Environment Variables Reference

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:5001/api  # Development
# VITE_API_URL=https://your-backend.onrender.com/api  # Production
```

### Backend (.env)
```bash
# Server
PORT=5001
NODE_ENV=development

# CORS
FRONTEND_URL=http://localhost:8080  # Development
CORS_ORIGIN=http://localhost:8080   # Development
# FRONTEND_URL=https://your-app.vercel.app  # Production
# CORS_ORIGIN=https://your-app.vercel.app   # Production

# Cache
CACHE_TTL_MINUTES=10
CACHE_TTL_SECONDS=600
```

---

## Part 6: Continuous Deployment

Both Vercel and Render support automatic deployments:

### Automatic Deployments

1. **Push to GitHub**: 
   ```powershell
   git add .
   git commit -m "Update feature"
   git push
   ```

2. **Vercel**: Automatically rebuilds and deploys frontend
3. **Render**: Automatically rebuilds and deploys backend

### Preview Deployments (Vercel)

- Every pull request gets a unique preview URL
- Test changes before merging to main
- Preview URLs follow pattern: `https://your-app-git-branch.vercel.app`

---

## Part 7: Monitoring and Logs

### Vercel Logs

1. Go to Vercel dashboard
2. Select your project
3. Click **"Deployments"** tab
4. Click on a deployment to see build logs
5. Click **"Runtime Logs"** for application logs

### Render Logs

1. Go to Render dashboard
2. Select your backend service
3. Click **"Logs"** tab
4. View real-time logs
5. Use search/filter to debug issues

---

## Part 8: Performance Optimization

### Frontend Optimizations

1. **Enable Compression** (already configured in backend)
2. **Lazy Loading**: Images and components
3. **Code Splitting**: Vite does this automatically
4. **CDN**: Vercel uses a global CDN automatically

### Backend Optimizations

1. **Caching**: Already implemented with 10-minute TTL
2. **Rate Limiting**: Configured at 100 requests/minute
3. **Compression**: Gzip compression enabled
4. **Database**: Consider adding Redis for caching (paid add-on)

---

## Part 9: Scaling and Upgrades

### When to Upgrade

Consider upgrading when:
- Backend sleeps too often (Render Free → Render Starter $7/month)
- Need faster builds (Vercel Hobby → Vercel Pro $20/month)
- Traffic exceeds free tier limits
- Need custom domains

### Upgrade Options

**Render Plans**:
- **Free**: $0 - 750 hours/month, sleeps after 15 min
- **Starter**: $7/month - Always on, 512MB RAM
- **Standard**: $25/month - 2GB RAM, better performance

**Vercel Plans**:
- **Hobby**: $0 - Personal projects, 100GB bandwidth
- **Pro**: $20/month - Commercial use, 1TB bandwidth
- **Enterprise**: Custom - Advanced features, support

---

## Part 10: Custom Domains

### Adding Custom Domain to Vercel

1. Buy a domain (e.g., from Namecheap, GoDaddy)
2. In Vercel project settings, go to **"Domains"**
3. Click **"Add"** and enter your domain
4. Follow DNS configuration instructions
5. Wait for DNS propagation (5-30 minutes)

### Adding Custom Domain to Render

1. In Render service settings, go to **"Custom Domains"**
2. Click **"Add Custom Domain"**
3. Enter your API subdomain (e.g., `api.yourdomain.com`)
4. Add CNAME record in your DNS provider
5. Update `VITE_API_URL` in Vercel to use new domain

---

## Part 11: Backup and Security

### Environment Variables Security

- **Never commit** `.env` files to GitHub
- Use `.env.example` as template (already included)
- Rotate API keys regularly if using external services
- Use different values for dev and production

### Data Backup

Currently using in-memory data. To add persistence:

1. **Add PostgreSQL** (Render add-on)
2. **Add Redis** for caching (Render add-on)
3. **Update services** to use databases
4. **Set up automated backups** (Render does this automatically)

---

## Part 12: Troubleshooting Commands

### Check Backend Health

```powershell
# Test backend API
Invoke-RestMethod -Uri "https://your-backend.onrender.com/api/countries" -Method Get
```

### Check Frontend Build Locally

```powershell
# Build and preview
npm run build
npm run preview

# Open http://localhost:4173
```

### Check Environment Variables

```powershell
# Vercel CLI (install first: npm i -g vercel)
vercel env ls

# Render - Check in dashboard under "Environment" tab
```

---

## Quick Reference Commands

```powershell
# Development
npm run dev              # Frontend only
npm run dev:backend      # Backend only
npm run dev:all          # Both servers

# Build
npm run build            # Production build
npm run build:dev        # Development build

# Preview
npm run preview          # Preview production build locally

# Git
git add .
git commit -m "message"
git push                 # Triggers auto-deploy
```

---

## Support and Resources

- **Vercel Docs**: https://vercel.com/docs
- **Render Docs**: https://render.com/docs
- **Vite Docs**: https://vitejs.dev
- **React Docs**: https://react.dev

---

## Next Steps After Deployment

1. ✅ Test all features on production
2. ✅ Share your live URL
3. ⚠️ Monitor logs for errors
4. ⚠️ Set up uptime monitoring (e.g., UptimeRobot)
5. ⚠️ Configure custom domain (optional)
6. ⚠️ Add analytics (e.g., Google Analytics)
7. ⚠️ Set up error tracking (e.g., Sentry)

---

**Congratulations! Your car comparison website is now live! 🎉**

Your URLs:
- **Frontend**: `https://your-app.vercel.app`
- **Backend API**: `https://your-backend.onrender.com/api`

Remember to update the README.md with your live URLs once deployed.
