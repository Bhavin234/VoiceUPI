# ⚡ Quick Deploy Guide - Render + Vercel

## 🎯 Complete Deployment in 20 Minutes

### Prerequisites
- GitHub account
- Code pushed to GitHub repository
- No credit card needed!

---

## Step 1: Deploy Backend to Render (10 minutes)

### 1.1 Create Render Account
```
1. Go to: https://render.com
2. Click "Get Started for Free"
3. Sign up with GitHub
4. Verify email
```

### 1.2 Create Web Service
```
1. Click "New +" button
2. Select "Web Service"
3. Click "Connect account" (authorize GitHub)
4. Find and select "VoiceUPI" repository
```

### 1.3 Configure Settings
```
Name: voicepay-backend
Root Directory: backend
Environment: Node
Build Command: npm install
Start Command: npm start
Region: Choose closest to you
Plan: Free
```

### 1.4 Add Environment Variables

Click "Advanced" and add these:

```
NODE_ENV=production
JWT_SECRET=voicepay_production_secret_2025_make_this_very_long_and_random
JWT_EXPIRE=7d
USE_MEMORY_DB=true
ALLOWED_ORIGINS=https://voicepay.vercel.app
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**Important:** Change `ALLOWED_ORIGINS` after you get your Vercel URL!

### 1.5 Deploy
```
1. Click "Create Web Service"
2. Wait 5-10 minutes (watch the logs)
3. Look for: "✅ Server running in production mode"
4. Copy your URL: https://voicepay-backend.onrender.com
```

✅ **Backend Done!**

---

## Step 2: Deploy Frontend to Vercel (5 minutes)

### 2.1 Create Vercel Account
```
1. Go to: https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel
```

### 2.2 Import Project
```
1. Click "New Project"
2. Find "VoiceUPI" repository
3. Click "Import"
```

### 2.3 Configure Settings
```
Root Directory: frontend
Framework Preset: Vite
Build Command: npm run build
Output Directory: dist
```

### 2.4 Add Environment Variable
```
Click "Environment Variables" → Add:

Name: VITE_API_URL
Value: https://voicepay-backend.onrender.com
(Use YOUR Render URL from Step 1.5)
```

### 2.5 Deploy
```
1. Click "Deploy"
2. Wait 2-3 minutes
3. Copy your URL: https://voicepay.vercel.app
```

✅ **Frontend Done!**

---

## Step 3: Update CORS (2 minutes)

### 3.1 Update Backend
```
1. Go back to Render dashboard
2. Select your web service
3. Click "Environment" tab
4. Find ALLOWED_ORIGINS variable
5. Change to: https://voicepay.vercel.app
   (Use YOUR Vercel URL from Step 2.5)
6. Click "Save Changes"
7. Render will auto-redeploy (wait 2-3 minutes)
```

✅ **CORS Fixed!**

---

## Step 4: Test Everything (3 minutes)

### 4.1 Test Backend
Open in browser:
```
https://voicepay-backend.onrender.com/health
```

Should see:
```json
{
  "success": true,
  "message": "VoicePay API is running",
  "timestamp": "2025-10-30..."
}
```

### 4.2 Test Frontend
```
1. Open: https://voicepay.vercel.app
2. Should see login page
3. Login with:
   Phone: 9876543210
   PIN: 1234
```

### 4.3 Test Voice Commands
```
1. Click microphone button
2. Allow microphone access
3. Say: "Send 500 rupees to Priya"
4. Verify transaction completes
5. Check balance updates
```

✅ **Everything Working!**

---

## 🎉 You're Live!

### Your Deployment URLs:
```
Frontend: https://voicepay.vercel.app
Backend: https://voicepay-backend.onrender.com
Health: https://voicepay-backend.onrender.com/health
```

### For Submission:
```
Live Demo: https://voicepay.vercel.app
API Endpoint: https://voicepay-backend.onrender.com
Demo Credentials: 
  Phone: 9876543210
  PIN: 1234
```

---

## ⚠️ Important Notes

### Render Free Tier
- Service sleeps after 15 minutes of inactivity
- First request takes 30-60 seconds to wake up
- **For Demo:** Load the site 1 minute before presenting
- **Solution:** Ping the health endpoint to wake it up

### Wake Up Service Before Demo
```bash
# Run this 1 minute before your demo/presentation
curl https://voicepay-backend.onrender.com/health
```

Or visit the URL in browser to wake it up!

---

## 🐛 Troubleshooting

### Problem: Render Build Fails

**Check:**
1. Is `package.json` in backend folder?
2. Start command correct: `npm start`?
3. Check Render logs for errors

**Fix:**
- Go to Render → Logs tab
- Look for red error messages
- Usually it's missing dependencies

### Problem: Frontend Can't Connect

**Check:**
1. Is backend URL correct in Vercel env variables?
2. Is CORS configured with exact Vercel URL?
3. Is backend service running (green in Render)?

**Fix:**
```
1. Vercel → Project → Settings → Environment Variables
2. Verify VITE_API_URL is correct
3. Redeploy if needed
```

### Problem: Voice Not Working

**Check:**
1. Using Chrome or Edge?
2. Microphone permissions allowed?
3. Using HTTPS (Vercel auto-provides this)?

**Fix:**
- Clear browser cache
- Try incognito mode
- Check browser console (F12)

### Problem: Service Waking Up Slow

**This is normal for Render free tier!**

**For Demo:**
1. Open backend health endpoint 1 minute before
2. Wait for response
3. Then start demo
4. Or upgrade to Render Starter ($7/month) for always-on

---

## 📋 Deployment Checklist

### Before Deploying:
- [x] Code pushed to GitHub
- [x] Both backend and frontend folders exist
- [x] package.json files are correct

### Render (Backend):
- [ ] Account created
- [ ] Web service created
- [ ] Environment variables added
- [ ] Service deployed successfully
- [ ] Health endpoint works
- [ ] URL copied

### Vercel (Frontend):
- [ ] Account created  
- [ ] Project imported
- [ ] Environment variable added
- [ ] Deployment successful
- [ ] Site loads correctly
- [ ] URL copied

### Final Steps:
- [ ] CORS updated with Vercel URL
- [ ] Backend redeployed
- [ ] Full integration tested
- [ ] Voice commands work
- [ ] Transaction completes
- [ ] URLs documented for submission

---

## 🚀 Next Steps

Now that you're deployed:

1. **Take Screenshots** of live app
2. **Record Demo Video** using live URLs
3. **Document URLs** in submission form
4. **Test Everything** one more time
5. **Submit Your Project** 🎉

---

## 📞 Quick Links

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Your Backend:** https://voicepay-backend.onrender.com
- **Your Frontend:** https://voicepay.vercel.app

---

**Deployment Complete! 🎊**

**Total Time:** ~20 minutes
**Total Cost:** $0 (FREE!)
**Status:** ✅ Production Ready

Now go record that demo video and submit! 💪
