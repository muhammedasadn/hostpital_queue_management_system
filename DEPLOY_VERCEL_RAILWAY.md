# Deploy Free on Vercel + Railway

Complete guide to deploy your Hospital Queue System for FREE using Vercel (Frontend) and Railway (Backend).

**Total Cost:** $0
**No Credit Card Required**
**Setup Time:** ~30 minutes

---

## 🎯 OVERVIEW

```
Your Hospital Queue System
    ↓
    ├─ Frontend (React) → Vercel 🚀
    │  Free hosting
    │  Lightning fast
    │  https://hospital-queue-client.vercel.app
    │
    └─ Backend (Node.js) → Railway 🚂
       Free tier ($5/month free)
       Easy deployment
       https://your-railway-backend.railway.app
```

---

## ✅ PRE-DEPLOYMENT CHECKLIST

- [ ] Code pushed to GitHub
- [ ] GitHub account ready
- [ ] You have internet connection
- [ ] About 30 minutes of time

---

## 🚀 STEP 1: DEPLOY FRONTEND ON VERCEL

### 1.1 Go to Vercel

Visit: https://vercel.com

### 1.2 Sign Up / Sign In

- Click **"Sign Up"** (or Sign In if you have account)
- Choose **"Continue with GitHub"**
- Authorize Vercel to access GitHub
- Complete signup

### 1.3 Import Your Repository

1. After sign up, you'll see dashboard
2. Click **"Add New"** button
3. Select **"Project"**
4. You'll see your GitHub repos listed
5. Find: `hospital-queue-management-system`
6. Click **"Import"**

### 1.4 Configure Project

You'll see a project setup screen:

- **Project Name:** `hospital-queue-client` (auto-filled, can change)
- **Framework:** Select **React** (if not auto-selected)
- **Root Directory:** Make sure it says `client`
- Everything else: Leave default

### 1.5 Add Environment Variables

**IMPORTANT:** You need to set these before deploying.

On the setup screen, look for **"Environment Variables"** section:

1. Click **"Add Environment Variable"**
2. Add these two variables:

**Variable 1:**
```
Name: REACT_APP_API_URL
Value: https://hospital-queue-server-production.up.railway.app/api
```
(You'll update this value later with actual Railway URL)

**Variable 2:**
```
Name: REACT_APP_SOCKET_URL
Value: https://hospital-queue-server-production.up.railway.app
```
(You'll update this value later with actual Railway URL)

For now, you can use placeholder URLs or just add empty values - we'll update them after Railway deploys.

### 1.6 Deploy

1. Click **"Deploy"** button
2. Vercel will build and deploy your app
3. Wait for build to complete (2-3 minutes)
4. You'll see: **"Deployment successful! 🎉"**

### 1.7 Get Your Frontend URL

After deployment:

1. You'll see a message: **"Congratulations!"**
2. Copy the URL shown (looks like: `https://hospital-queue-client.vercel.app`)
3. **Save this URL** - you'll need it for Railway deployment

### 1.8 Test Frontend

1. Click the URL to open your app
2. You should see the Role Selection page
3. **Don't click buttons yet** (backend not deployed)

---

## 🚂 STEP 2: DEPLOY BACKEND ON RAILWAY

### 2.1 Go to Railway

Visit: https://railway.app

### 2.2 Sign Up / Sign In

- Click **"Sign Up"**
- Choose **"Sign up with GitHub"**
- Authorize Railway
- Complete signup

### 2.3 Create New Project

1. After login, click **"New Project"**
2. You'll see options
3. Select **"Deploy from GitHub repo"**

### 2.4 Select Your Repository

1. You'll see your GitHub repos
2. Find and click: `hospital-queue-management-system`
3. Railway will analyze the repo

### 2.5 Configure Service

Railway should auto-detect Node.js and the server folder.

If not, you might need to:
- Set **Root Directory:** `server`
- Set **Start Command:** `npm start`

### 2.6 Add Environment Variables

In Railway dashboard for your service:

1. Go to **"Variables"** tab
2. Add these environment variables:

```
KEY: NODE_ENV
VALUE: production
```

```
KEY: PORT
VALUE: 5000
```

```
KEY: FRONTEND_URL
VALUE: [YOUR_VERCEL_URL]
```
(Replace with your Vercel URL from Step 1.7, e.g., `https://hospital-queue-client.vercel.app`)

3. Save variables

### 2.7 Deploy

1. Railway should auto-deploy
2. Watch the deployment log
3. Wait for message: **"Deployment successful"**

### 2.8 Get Backend URL

After deployment:

1. Go to **"Settings"** tab
2. Look for **"Public Domain"**
3. Copy the URL (looks like: `https://hospital-queue-server-production.up.railway.app`)
4. **Save this URL**

---

## 🔗 STEP 3: CONNECT FRONTEND TO BACKEND

Now update Vercel with the Railway backend URL.

### 3.1 Go Back to Vercel

Visit: https://vercel.com/dashboard

### 3.2 Open Your Project

Click on: `hospital-queue-client`

### 3.3 Go to Settings

1. Click **"Settings"** tab (top menu)
2. Click **"Environment Variables"** (left sidebar)

### 3.4 Update Variables

You should see two variables you added earlier:
- `REACT_APP_API_URL`
- `REACT_APP_SOCKET_URL`

**Edit both to use your Railway URL:**

```
REACT_APP_API_URL = [YOUR_RAILWAY_URL]/api
REACT_APP_SOCKET_URL = [YOUR_RAILWAY_URL]
```

Example:
```
REACT_APP_API_URL = https://hospital-queue-server-production.up.railway.app/api
REACT_APP_SOCKET_URL = https://hospital-queue-server-production.up.railway.app
```

### 3.5 Redeploy Vercel

1. Go to **"Deployments"** tab
2. Find latest deployment
3. Click the three dots menu
4. Select **"Redeploy"**
5. Wait for deployment (2-3 minutes)

---

## ✅ STEP 4: VERIFY EVERYTHING WORKS

### 4.1 Open Your App

1. Open your Vercel frontend URL
2. You should see: **Role Selection page**

### 4.2 Test Patient Interface

1. Click **"👤 Patient"** button
2. Should see: **Patient Dashboard**
3. Try **"📝 Book Token"** tab
4. Fill in name and select department
5. Click **"🎫 Book Token"**
6. Should see: ✅ Success message

### 4.3 Test Doctor Interface

1. Go back (click back button)
2. Click **"👨‍⚕️ Doctor / Staff"** button
3. Should see: **Doctor Dashboard**
4. Should see: Queues and counters
5. Everything loading? ✅ Success!

### 4.4 Check Console for Errors

1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for red errors
4. Should see: **"Connected"** (WebSocket working)

---

## 🎉 YOU'RE DEPLOYED!

Your Hospital Queue Management System is now LIVE on the internet!

### Your URLs:
- **Frontend:** https://hospital-queue-client.vercel.app
- **Backend:** https://hospital-queue-server-production.up.railway.app

### Share with others:
Send them: `https://hospital-queue-client.vercel.app`

---

## 🔄 UPDATING YOUR APP

When you make changes:

### To update frontend:
1. Make changes in `client` folder
2. Commit: `git add . && git commit -m "message" && git push`
3. Vercel auto-deploys (2-3 min)

### To update backend:
1. Make changes in `server` folder
2. Commit: `git add . && git commit -m "message" && git push`
3. Railway auto-deploys (1-2 min)

---

## 🐛 TROUBLESHOOTING

### Issue: App won't load
**Check:**
1. Vercel deployment status - go to Deployments tab
2. Is it showing green "Ready"?
3. If not, click it and check the build logs

### Issue: "Cannot connect to API" error
**Check:**
1. Did you update Vercel environment variables?
2. Did you redeploy Vercel after updating?
3. Check browser Network tab for API requests
4. Should start with `https://...railway...`

### Issue: WebSocket won't connect
**Check:**
1. Same as above - wrong API URL
2. Make sure `REACT_APP_SOCKET_URL` is set correctly
3. Check browser console for WebSocket errors

### Issue: Backend won't deploy on Railway
**Check:**
1. Go to Railway dashboard
2. Click your project
3. Check the deployment logs
4. Look for error messages
5. Ensure `PORT=5000` is set in variables

### Issue: Patient can't book token
**Check:**
1. Check browser Network tab (F12)
2. Look for POST request to `/api/queue/book`
3. Check the response - should be successful
4. If 404, backend URL might be wrong
5. If error, check Railway backend logs

---

## 💡 IMPORTANT NOTES

### Data Persistence:
- **Current:** Data resets when services restart
- **To Fix:** Add MongoDB Atlas (free tier available)
- Future project: Implement database integration

### Free Tier Limits:
- **Vercel:** Plenty for small projects
- **Railway:** $5/month free tier - more than enough

### Performance:
- **Frontend:** Very fast (Vercel uses CDN)
- **Backend:** Fast enough for hospital queue system
- **Real-time:** Works perfectly with WebSocket

---

## 🚀 NEXT STEPS

### Option A: Everything works? 
You're done! 🎉 Your app is live!

### Option B: Want to add database?
1. Create MongoDB Atlas free account
2. Get connection string
3. Add to Railway `MONGODB_URI` variable
4. Implement database in backend

### Option C: Want to add more features?
1. Make changes locally
2. Test on localhost
3. Push to GitHub
4. Auto-deploys to production

---

## 📞 HELP & RESOURCES

- **Vercel Docs:** https://vercel.com/docs
- **Railway Docs:** https://docs.railway.app
- **For error logs:**
  - Vercel: Go to Deployments → click deployment → Logs
  - Railway: Go to project → View logs

---

## ✨ SUMMARY

**You now have:**
✅ Frontend deployed on Vercel (free, fast)
✅ Backend deployed on Railway (free, working)
✅ Real-time WebSocket communication
✅ Hospital Queue System live on internet
✅ Auto-deploys on GitHub push
✅ $0 cost

**Next:** Share your app URL with others! 🎉

---

**Congratulations on deploying your Hospital Queue Management System for FREE!** 🏥🚀
