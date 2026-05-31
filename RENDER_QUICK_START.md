# Render Deployment Quick Start

## 🚀 5-Minute Quick Deploy

### 1. Create GitHub Repository
```bash
git init
git add .
git commit -m "Hospital Queue Management System"
git remote add origin https://github.com/YOUR_USERNAME/hospital-queue-management.git
git push -u origin main
```

### 2. Deploy to Render

1. Go to https://render.com → Sign up/Login
2. Click **"New +"** → **"Blueprint"**
3. Select your GitHub repository
4. Render will auto-detect `render.yaml`
5. Click **"Create New Blueprint"**

That's it! ✅

---

## 🔗 Access Your App

After deployment (5-10 minutes):

- **Frontend**: `https://hospital-queue-client.onrender.com`
- **Backend**: `https://hospital-queue-server.onrender.com`

---

## ⚠️ Important Notes

- Free tier services spin down after 15 min of inactivity
- Data is not persistent (resets on restart)
- Check Render dashboard for deployment logs if issues occur
- Update `FRONTEND_URL` in backend environment after frontend deploys

---

**Full Guide**: See `RENDER_DEPLOYMENT_GUIDE.md` for detailed instructions
