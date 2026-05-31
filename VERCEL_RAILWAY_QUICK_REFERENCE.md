# 🚀 Vercel + Railway Free Deployment - Quick Reference

**Print or bookmark this for quick reference!**

---

## ⚡ DEPLOYMENT SUMMARY

**Cost:** FREE
**Credit Card:** NOT REQUIRED
**Setup Time:** ~30 minutes
**No hosting fees ever!**

---

## 🎯 WHAT YOU'RE DOING

```
Your App on GitHub
    ↓
    ├─ Frontend → Vercel (fast CDN)
    │  
    └─ Backend → Railway (Node.js server)
```

---

## 📋 QUICK CHECKLIST

Before starting:
- [ ] Code pushed to GitHub
- [ ] GitHub account ready
- [ ] 30 minutes free time

---

## 🚀 STEP-BY-STEP (Copy & Paste URLs)

### PHASE 1: DEPLOY FRONTEND ON VERCEL (10 min)

**1. Go to Vercel:**
```
https://vercel.com
```

**2. Sign up:**
- Click "Sign Up"
- Choose "Sign up with GitHub"
- Authorize Vercel

**3. Create project:**
- Click "Add New" → "Project"
- Select repo: `hospital-queue-management-system`
- Click "Import"

**4. Configure:**
- Framework: React
- Root: `client`
- Add Environment Variables:

```
REACT_APP_API_URL=https://hospital-queue-server-production.up.railway.app/api
REACT_APP_SOCKET_URL=https://hospital-queue-server-production.up.railway.app
```

**5. Deploy:**
- Click "Deploy"
- Wait 2-3 minutes

**6. Get URL:**
- Copy your Vercel URL (e.g., `https://hospital-queue-client.vercel.app`)
- Save it

---

### PHASE 2: DEPLOY BACKEND ON RAILWAY (10 min)

**1. Go to Railway:**
```
https://railway.app
```

**2. Sign up:**
- Click "Sign Up"
- Choose "Sign up with GitHub"
- Authorize Railway

**3. Create project:**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Select repo: `hospital-queue-management-system`

**4. Configure:**
- Root Directory: `server`
- Start Command: `npm start`

**5. Add Environment Variables:**

```
NODE_ENV=production
PORT=5000
FRONTEND_URL=[YOUR_VERCEL_URL]
```

Example:
```
FRONTEND_URL=https://hospital-queue-client.vercel.app
```

**6. Deploy:**
- Railway auto-deploys
- Wait 2-3 minutes

**7. Get URL:**
- Go to "Settings"
- Copy "Public Domain" URL
- Save it (e.g., `https://hospital-queue-server-production.up.railway.app`)

---

### PHASE 3: CONNECT BACKEND TO FRONTEND (5 min)

**1. Go back to Vercel:**
```
https://vercel.com/dashboard
```

**2. Open project:**
- Click `hospital-queue-client`

**3. Update variables:**
- Click "Settings" → "Environment Variables"
- Edit `REACT_APP_API_URL`:
  ```
  [YOUR_RAILWAY_URL]/api
  ```
- Edit `REACT_APP_SOCKET_URL`:
  ```
  [YOUR_RAILWAY_URL]
  ```

**4. Redeploy:**
- Go to "Deployments"
- Click latest deployment (three dots)
- Click "Redeploy"
- Wait 2-3 minutes

---

## ✅ VERIFICATION

**Test your app:**

1. Open your Vercel frontend URL
2. You should see Role Selection page
3. Click "Patient" button
4. Try booking a token
5. Should see success message ✅
6. Check browser console (F12) - should see "Connected"

---

## 🌐 YOUR LIVE URLs

After deployment:

- **Frontend:** `https://hospital-queue-client.vercel.app`
- **Backend:** `https://your-railway-backend.up.railway.app`

---

## 🔄 UPDATING YOUR APP

**To update:**
1. Make changes locally
2. Commit & push to GitHub:
   ```bash
   git add .
   git commit -m "Update"
   git push origin main
   ```
3. Both Vercel and Railway auto-deploy (5 min)

---

## 🐛 TROUBLESHOOTING

| Issue | Fix |
|-------|-----|
| "Cannot connect to API" | Update Vercel env vars with Railway URL, redeploy |
| WebSocket won't connect | Same as above |
| Backend won't deploy | Check Railway logs, ensure PORT=5000 |
| Frontend won't deploy | Check Vercel logs, ensure root=client |

---

## 📞 HELP

- **Detailed Guide:** `DEPLOY_VERCEL_RAILWAY.md`
- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app

---

## 💰 COST BREAKDOWN

| Service | Cost |
|---------|------|
| Vercel | FREE |
| Railway | FREE (free tier) |
| **TOTAL** | **$0** |

---

## 🎉 DONE!

Your Hospital Queue Management System is now:
✅ Live on the internet
✅ Running 24/7
✅ Completely FREE
✅ Auto-updating on GitHub push

**Share your frontend URL:**
```
https://hospital-queue-client.vercel.app
```

---

**Congratulations! Your app is deployed!** 🚀
