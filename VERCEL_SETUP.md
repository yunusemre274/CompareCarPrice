# Environment Variables for Production (Vercel)

Copy these environment variables to your Vercel dashboard:

## Frontend Environment Variables (Vercel Dashboard)

Go to: **Project Settings → Environment Variables**

Add the following:

### Production Environment Variable
```
Key: VITE_API_URL
Value: https://comparecarprice.onrender.com/api
```

**Important Notes:**
1. Set this for **Production**, **Preview**, and **Development** environments
2. After adding, trigger a new deployment for changes to take effect
3. Verify the variable is set correctly by checking the deployment logs

---

## Backend Environment Variables (Render Dashboard)

Go to: **Your Service → Environment**

Update the following:

### CORS Configuration
```
Key: FRONTEND_URL
Value: https://your-app-name.vercel.app
```

```
Key: CORS_ORIGIN  
Value: https://your-app-name.vercel.app
```

**Replace `your-app-name` with your actual Vercel project name**

---

## Verification Steps

### 1. Local Development (Optional - for testing with local backend)
To test locally with your local backend, create a `.env.local` file:
```bash
VITE_API_URL=http://localhost:5001/api
```

### 2. Check Console Logs
After deployment, open your browser console (F12) and look for:
```
🔗 API Base URL: https://comparecarprice.onrender.com/api
CountryPanel API URL: https://comparecarprice.onrender.com/api
```

### 3. Test API Connection
Visit your Vercel app and:
- Search for a car (e.g., "Toyota Camry")
- Check if data loads successfully
- Click on a country row to see country details
- If errors occur, check the browser console for details

---

## Troubleshooting

### Issue: Still seeing localhost URLs in console
**Solution**: 
- Clear browser cache (Ctrl+Shift+R)
- Verify environment variable is set in Vercel dashboard
- Redeploy your Vercel app

### Issue: CORS errors in browser console
**Solution**:
- Check that FRONTEND_URL in Render matches your Vercel domain exactly
- Include `https://` in the URL
- Redeploy backend after updating CORS settings

### Issue: API returns 404 or 500 errors
**Solution**:
- Test backend directly: https://comparecarprice.onrender.com/api/countries
- Check Render logs for errors
- Verify backend is in "Live" status (not sleeping)

---

## Quick Commands

```powershell
# Local development with production backend
npm run dev

# Local development with local backend (create .env.local first)
npm run dev

# Build and test locally
npm run build
npm run preview
```
