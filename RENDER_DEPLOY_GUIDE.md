# Deploy MDRG Backend to Render (Starter Plan)

This guide will walk you through deploying the MDRG backend to Render's Starter plan ($7/month).

## Why Starter Plan?

| Feature | Free Plan | Starter Plan |
|---------|-----------|--------------|
| Price | $0 | $7/month |
| Persistent Storage | ❌ No | ✅ Yes (1GB disk) |
| 24/7 Uptime | ❌ Sleeps after 15 min | ✅ Always on |
| Database | ❌ Resets on restart | ✅ Persists forever |
| Custom Domain | ✅ Yes | ✅ Yes |
| SSL Certificate | ✅ Yes | ✅ Yes |

**For a professional debt recovery business, the Starter plan is essential!**

---

## Prerequisites

- A GitHub account
- Your code uploaded to GitHub
- A Render account
- Credit/debit card for payment

---

## Step 1: Upload to GitHub

### Option A: GitHub Desktop (Easiest)

1. Download: https://desktop.github.com
2. Sign in with your GitHub account
3. Click **"File"** → **"New Repository"**
4. Name: `mdrg-backend`
5. Local path: Browse to your extracted `render-deploy` folder
6. Click **"Create Repository"**
7. Click **"Publish repository"**
8. Keep it **Public**
9. Click **"Publish"**

### Option B: Command Line

```bash
cd render-deploy
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mdrg-backend.git
git push -u origin main
```

---

## Step 2: Deploy on Render

### Using Blueprint (Recommended)

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub account
4. Select your `mdrg-backend` repository
5. Click **"Apply"**
6. The `render.yaml` file will automatically configure everything

### Manual Web Service

1. Go to: https://dashboard.render.com
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub account
4. Select your `mdrg-backend` repository
5. Configure:
   - **Name:** mdrg-backend
   - **Runtime:** Node
   - **Region:** Choose closest to UK (Frankfurt)
   - **Branch:** main
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Starter ($7/month)
6. Click **"Create Web Service"**

---

## Step 3: Add Persistent Disk

**This is CRITICAL - without a disk, your database will be lost!**

1. In your Render dashboard, click on your `mdrg-backend` service
2. Go to **"Disks"** tab
3. Click **"Add Disk"**
4. Configure:
   - **Name:** mdrg-data
   - **Mount Path:** `/data`
   - **Size:** 1 GB (included in Starter plan)
5. Click **"Create"**

---

## Step 4: Add Environment Variables

1. Go to **"Environment"** tab
2. Add these variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `JWT_SECRET` | (generate a random string - see below) |
| `PORT` | `10000` |

**To generate JWT_SECRET:**
- Go to: https://jwtsecret.com/generate
- Copy the generated string
- Paste it as the value

3. Click **"Save Changes"**

---

## Step 5: Deploy

1. Go to **"Deploy"** tab
2. Click **"Manual Deploy"** → **"Deploy latest commit"**
3. Wait for deployment (2-3 minutes)
4. Watch the logs for any errors

---

## Step 6: Test Your API

Once deployed, your API will be at:
```
https://mdrg-backend.onrender.com/api/health
```

Open this in your browser. You should see:
```json
{
  "success": true,
  "message": "MDRG API is running.",
  "timestamp": "...",
  "version": "1.0.0"
}
```

---

## Step 7: Update Your Frontend

1. Copy your Render URL (e.g., `https://mdrg-backend.onrender.com`)
2. Update `src/services/api.ts` in your frontend:
   ```typescript
   const API_BASE_URL = 'https://mdrg-backend.onrender.com/api';
   ```
3. Rebuild: `npm run build`
4. Redeploy to Netlify

---

## Step 8: Set Up Billing

1. In Render dashboard, click your profile (top right)
2. Go to **"Billing"**
3. Add your payment method
4. Your $7/month Starter plan is now active

---

## Troubleshooting

### "Build failed"
- Check that all files are at the root of your repository
- Check the build logs for specific errors
- Make sure `package.json` is present

### "Database not persisting"
- Make sure you added the disk in Step 3
- Check that the disk mount path is `/data`

### "Cannot connect from frontend"
- Check CORS settings in `src/server.js`
- Verify your Netlify URL is allowed

---

## Important Notes

- **Monthly cost:** $7 USD (about £5.50 GBP)
- **Billing:** Charged monthly to your card
- **Cancel anytime:** No contract, cancel in dashboard
- **Database:** Now persists forever with the disk
- **Uptime:** 24/7, no sleeping

---

## Need Help?

If you get stuck:
1. Check the Render logs for error messages
2. Share the error with me
3. I'll help you fix it!

---

## Summary

| Step | Action |
|------|--------|
| 1 | Upload to GitHub |
| 2 | Create Web Service on Render (Starter plan) |
| 3 | Add 1GB disk at `/data` |
| 4 | Add environment variables |
| 5 | Deploy |
| 6 | Test API |
| 7 | Update frontend API URL |
| 8 | Add payment method |

**Your professional backend will be live and reliable!** 🎉
