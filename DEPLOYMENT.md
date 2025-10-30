# 🚀 VoicePay Deployment Guide (Updated)

## Deployment Options

### Backend Deployment (FREE Options)
1. **Render** (Recommended - Free tier, no credit card)
2. **Cyclic.sh** (Easy, GitHub integration)
3. **Fly.io** (Free tier available)
4. **Glitch** (Simple, instant deploy)
5. **Koyeb** (Free tier with good limits)

### Frontend Deployment
1. **Vercel** (Recommended - Free tier)

---

## Option 1: Render + Vercel (Recommended)

### Backend on Render

**Step 1: Prepare Repository**
```bash
cd D:\GitHub\VoiceUPI
git add .
git commit -m "Ready for deployment"
git push origin main
```

**Step 2: Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (no credit card required)
3. Verify email

**Step 3: Deploy Backend**

1. Click "New +" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** voicepay-backend
   - **Root Directory:** backend
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Plan:** Free

4. Add Environment Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=voicepay_production_secret_2025_make_this_very_long
   JWT_EXPIRE=7d
   USE_MEMORY_DB=true
   ALLOWED_ORIGINS=https://your-frontend.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. Click "Create Web Service"
6. Wait 5-10 minutes for deployment
7. Copy your URL: `https://voicepay-backend.onrender.com`

**Important Notes:**
- Render free tier spins down after inactivity
- First request may take 30-60 seconds to wake up
- Perfect for demos and MVPs

### Frontend on Vercel

**Step 1: Deploy to Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your VoiceUPI repository
5. Configure:
   - **Root Directory:** frontend
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`

**Step 2: Add Environment Variable**
```
VITE_API_URL=https://voicepay-backend.onrender.com
```

**Step 3: Deploy**
- Click "Deploy"
- Wait 2-3 minutes
- Copy URL: `https://voicepay.vercel.app`

**Step 4: Update Backend CORS**
1. Go to Render dashboard
2. Navigate to Environment
3. Update `ALLOWED_ORIGINS` with your Vercel URL
4. Save and wait for auto-redeploy

---

## Option 2: Cyclic.sh + Vercel

### Backend on Cyclic

**Step 1: Deploy to Cyclic**

1. Go to [cyclic.sh](https://cyclic.sh)
2. Click "Deploy Now" → Connect with GitHub
3. Select VoiceUPI repository
4. Cyclic auto-detects Node.js
5. Set root directory: `backend`

**Step 2: Configure Environment**

In Cyclic dashboard → Variables:
```
NODE_ENV=production
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
USE_MEMORY_DB=true
ALLOWED_ORIGINS=https://voicepay.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Step 3: Get URL**
- Cyclic provides URL: `https://voicepay.cyclic.app`
- Copy for frontend configuration

**Free Tier:**
- 10,000 requests/month
- Auto-sleeps after inactivity
- Good for MVPs

---

## Option 3: Fly.io + Vercel

### Backend on Fly.io

**Step 1: Install Fly CLI**

Windows (PowerShell):
```powershell
iwr https://fly.io/install.ps1 -useb | iex
```

**Step 2: Login and Initialize**
```bash
fly auth login
cd D:\GitHub\VoiceUPI\backend
fly launch
```

**Step 3: Configure**

When prompted:
- App name: voicepay-backend
- Region: Choose closest to you
- PostgreSQL: No
- Redis: No
- Deploy now: Yes

**Step 4: Set Environment Variables**
```bash
fly secrets set NODE_ENV=production
fly secrets set JWT_SECRET=your_secret_key
fly secrets set JWT_EXPIRE=7d
fly secrets set USE_MEMORY_DB=true
fly secrets set ALLOWED_ORIGINS=https://voicepay.vercel.app
```

**Step 5: Deploy**
```bash
fly deploy
```

Your URL: `https://voicepay-backend.fly.dev`

**Free Tier:**
- Up to 3 VMs
- 3GB persistent storage
- Generous bandwidth

---

## Option 4: Glitch + Vercel (Easiest)

### Backend on Glitch

**Step 1: Deploy to Glitch**

1. Go to [glitch.com](https://glitch.com)
2. Click "New Project" → "Import from GitHub"
3. Enter repository URL
4. Glitch clones your code

**Step 2: Configure**

1. Click `.env` in file list
2. Add environment variables:
   ```
   NODE_ENV=production
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   USE_MEMORY_DB=true
   ALLOWED_ORIGINS=https://voicepay.vercel.app
   ```

**Step 3: Set Start Command**

In `package.json`, ensure:
```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

**Step 4: Get URL**
- Glitch provides: `https://voicepay-backend.glitch.me`

**Note:** Glitch sleeps after 5 minutes of inactivity

---

## Option 5: Koyeb + Vercel

### Backend on Koyeb

**Step 1: Deploy to Koyeb**

1. Go to [koyeb.com](https://koyeb.com)
2. Sign up with GitHub
3. Click "Create App"
4. Select "GitHub" → Choose repository
5. Configure:
   - **Name:** voicepay-backend
   - **Branch:** main
   - **Build command:** `npm install`
   - **Run command:** `npm start`
   - **Port:** 5000

**Step 2: Add Environment Variables**
```
NODE_ENV=production
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
USE_MEMORY_DB=true
ALLOWED_ORIGINS=https://voicepay.vercel.app
```

**Step 3: Deploy**
- Click "Create Service"
- Wait for deployment
- Get URL: `https://voicepay-backend-yourname.koyeb.app`

**Free Tier:**
- 512MB RAM
- 2GB storage
- Always-on (no sleep)

---

## Comparison Table

| Platform | Free Tier | Sleep Mode | Deploy Time | Complexity |
|----------|-----------|------------|-------------|------------|
| **Render** | Yes | Yes (30s wake) | 5-10 min | Easy ⭐⭐⭐ |
| **Cyclic** | 10k req/month | Yes | 2-5 min | Very Easy ⭐⭐⭐⭐⭐ |
| **Fly.io** | 3 VMs | No | 5-10 min | Medium ⭐⭐ |
| **Glitch** | Unlimited | Yes (fast) | Instant | Very Easy ⭐⭐⭐⭐⭐ |
| **Koyeb** | 512MB | No | 5 min | Easy ⭐⭐⭐⭐ |

---

## Recommended Choice: Render

**Why Render?**
- ✅ No credit card required
- ✅ Easy GitHub integration
- ✅ Automatic deployments
- ✅ Good free tier
- ✅ Professional dashboard
- ✅ SSL included

**Limitations:**
- Sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake
- Good for demos/MVPs

---

## Complete Deployment Steps (Render + Vercel)

### Step 1: Push Code to GitHub
```bash
cd D:\GitHub\VoiceUPI
git add .
git commit -m "Production ready"
git push origin main
```

### Step 2: Deploy Backend (Render)

1. **Create Account**
   - Go to https://render.com
   - Click "Get Started for Free"
   - Sign up with GitHub

2. **Create Web Service**
   - Dashboard → "New +" → "Web Service"
   - Click "Connect account" to link GitHub
   - Select VoiceUPI repository
   
3. **Configure Service**
   ```
   Name: voicepay-backend
   Root Directory: backend
   Environment: Node
   Build Command: npm install
   Start Command: npm start
   Plan: Free
   ```

4. **Add Environment Variables**
   
   Click "Advanced" → Add Environment Variables:
   ```
   NODE_ENV=production
   JWT_SECRET=voicepay_secure_secret_key_2025_change_this
   JWT_EXPIRE=7d
   USE_MEMORY_DB=true
   ALLOWED_ORIGINS=https://voicepay.vercel.app
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Check logs for "Server started on port 5000"
   - Copy URL: `https://voicepay-backend.onrender.com`

### Step 3: Deploy Frontend (Vercel)

1. **Create Account**
   - Go to https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Dashboard → "New Project"
   - Import VoiceUPI repository
   
3. **Configure**
   ```
   Root Directory: frontend
   Framework: Vite
   Build Command: npm run build
   Output Directory: dist
   ```

4. **Add Environment Variable**
   ```
   VITE_API_URL=https://voicepay-backend.onrender.com
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Copy URL: `https://voicepay.vercel.app`

### Step 4: Update CORS

1. Go back to Render dashboard
2. Navigate to Environment tab
3. Edit `ALLOWED_ORIGINS` to your Vercel URL
4. Click "Save Changes"
5. Render will auto-redeploy

### Step 5: Test Deployment

1. **Test Backend**
   ```bash
   curl https://voicepay-backend.onrender.com/health
   ```
   Should return:
   ```json
   {"success":true,"message":"VoicePay API is running"}
   ```

2. **Test Frontend**
   - Open https://voicepay.vercel.app
   - Login with: 9876543210 / 1234
   - Try voice command
   - Verify transaction works

---

## Troubleshooting

### Issue: Render Service Won't Start

**Solution:**
```bash
# Check package.json has correct start script
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

### Issue: CORS Errors

**Solution:**
- Verify `ALLOWED_ORIGINS` matches exact Vercel URL
- Include `https://` protocol
- No trailing slash
- Redeploy backend after changes

### Issue: Render Service Sleeping

**Solution:**
- This is normal for free tier
- First request takes 30-60 seconds
- For demo, send a request to wake it up first
- Or upgrade to paid tier ($7/month)

### Issue: Frontend Can't Connect to Backend

**Solution:**
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify backend is running (check health endpoint)
3. Check browser console for errors
4. Verify CORS configuration

---

## Post-Deployment Checklist

### ✅ Backend (Render)
- [ ] Service is running (green status)
- [ ] Health endpoint returns 200
- [ ] Environment variables set
- [ ] Logs show no errors

### ✅ Frontend (Vercel)
- [ ] Site loads without errors
- [ ] Login page displays
- [ ] Can login with demo credentials
- [ ] Voice commands work (allow microphone)

### ✅ Integration
- [ ] Frontend connects to backend
- [ ] Transactions process successfully
- [ ] Balance updates correctly
- [ ] Transaction history loads

---

## URLs for Submission

Use these in your submission:

```
Backend API: https://voicepay-backend.onrender.com
Frontend App: https://voicepay.vercel.app
Health Check: https://voicepay-backend.onrender.com/health
Demo Credentials: Phone: 9876543210, PIN: 1234
```

---

## Cost Breakdown

### Free Forever
- **Render:** Free tier (with sleep)
- **Vercel:** Unlimited hobby projects
- **Total Cost:** $0/month

### If You Need Always-On (Optional)
- **Render Starter:** $7/month (no sleep)
- **Vercel:** Free (no upgrade needed)
- **Total Cost:** $7/month

---

## Alternative Quick Deploy

### If Render Doesn't Work

**Use Cyclic (Fastest):**
```bash
1. Go to cyclic.sh
2. Click "Deploy"
3. Connect GitHub
4. Select VoiceUPI
5. Set root: backend
6. Add env variables
7. Deploy (takes 2 minutes)
```

**Or Use Glitch (Easiest):**
```bash
1. Go to glitch.com
2. Import from GitHub
3. Add .env variables
4. Auto-deploys instantly
```

---

## Production Tips

1. **Keep Service Awake (Optional)**
   - Use UptimeRobot (free) to ping every 5 minutes
   - Or upgrade to paid tier

2. **Monitor Logs**
   - Render: Dashboard → Logs tab
   - Check for errors regularly

3. **Set Up Alerts**
   - Render: Dashboard → Notifications
   - Get email alerts for downtime

4. **Backup Important Data**
   - Export transaction data regularly
   - Keep local database backups

---

**You're all set with Render + Vercel! 🚀**

**Deploy Time:** ~15-20 minutes total
**Cost:** FREE
**Effort:** Easy ⭐⭐⭐
