# Deploying Hospital Queue Management System to Render

This guide will help you deploy your hospital queue management system to Render, a modern cloud platform.

## 📋 Prerequisites

Before you start, make sure you have:
- A GitHub account
- A Render account (free at https://render.com)
- Your code pushed to a GitHub repository

---

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

If you haven't already, push your project to GitHub:

```bash
git init
git add .
git commit -m "Initial commit - Hospital Queue Management System"
git remote add origin https://github.com/YOUR_USERNAME/hospital-queue-management.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `hospital-queue-management` with your GitHub username and repository name.

---

### Step 2: Create a Render Account

1. Go to https://render.com
2. Sign up with your GitHub account (recommended for easier linking)
3. Verify your email

---

### Step 3: Deploy Using Blueprint (Recommended)

#### Option A: Using render.yaml (Automatic Setup)

1. Go to your Render dashboard: https://dashboard.render.com
2. Click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and configure both services
5. Set environment variables (if needed)
6. Click **"Create New Blueprint"**

#### Option B: Manual Setup (If Blueprint doesn't work)

**Backend Service:**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Fill in the following:
   - **Name**: `hospital-queue-server`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Plan**: Free (or paid)

4. Go to **Environment** tab and add:
   ```
   NODE_ENV = production
   PORT = 5000
   FRONTEND_URL = https://your-frontend-url.onrender.com
   ```
   (Replace with your actual frontend URL after it's deployed)

5. Click **"Create Web Service"**
6. Wait for it to deploy (2-3 minutes)
7. Copy the backend URL (e.g., `https://hospital-queue-server.onrender.com`)

**Frontend Service:**
1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository again
3. Fill in the following:
   - **Name**: `hospital-queue-client`
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `cd client && npm run build`
   - **Start Command**: `cd client && npx serve -s build -l 3000`
   - **Plan**: Free (or paid)

4. Go to **Environment** tab and add:
   ```
   REACT_APP_API_URL = https://hospital-queue-server.onrender.com/api
   REACT_APP_SOCKET_URL = https://hospital-queue-server.onrender.com
   ```
   (Use the backend URL you copied)

5. Click **"Create Web Service"**
6. Wait for it to deploy (3-5 minutes)

---

## 🔧 Environment Variables

### Backend (.env)

Create a `.env` file in the `server` folder:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-url.onrender.com
```

### Frontend (.env)

Create a `.env` file in the `client` folder:

```env
REACT_APP_API_URL=https://your-backend-url.onrender.com/api
REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com
```

---

## ✅ Verification Checklist

After deployment, verify everything works:

- [ ] Backend service is running (status: "Live")
- [ ] Frontend service is running (status: "Live")
- [ ] You can access the frontend at its Render URL
- [ ] Role selection page loads correctly
- [ ] Patient dashboard loads without errors
- [ ] Doctor dashboard loads without errors
- [ ] Booking a token works
- [ ] WebSocket connection is established

### Common Issues:

**Issue: Frontend cannot connect to backend**
- Check that `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` point to correct backend URL
- Ensure backend is running and accepting requests
- Check browser console for CORS errors

**Issue: Build is failing**
- Check build logs in Render dashboard
- Ensure all dependencies are in package.json
- Check that node version is compatible

**Issue: Application crashes after deployment**
- Check logs in Render dashboard (click service → Logs)
- Ensure all environment variables are set correctly
- Check that PORT is correctly configured

---

## 📱 Accessing Your Application

Once deployed:

- **Frontend**: `https://hospital-queue-client.onrender.com`
- **Backend**: `https://hospital-queue-server.onrender.com`

Open the frontend URL in your browser to start using the application!

---

## 🔄 Updating Your Deployment

To update your application:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your commit message"
   git push
   ```
3. Render will automatically redeploy (if auto-deploy is enabled)
4. Monitor the deployment in Render dashboard

---

## 💾 Database (Optional Future Enhancement)

When you're ready to persist data:

1. Create a MongoDB Atlas cluster (free tier available)
2. Get your MongoDB connection string
3. Add to backend environment variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hospital-queue
   ```
4. Configure mongoose in your backend

---

## 🆓 Free Tier Limitations on Render

- **Spinning Down**: Services spin down after 15 minutes of inactivity
- **Build Time**: Limited build minutes per month
- **Storage**: No persistent storage (data resets)
- **Bandwidth**: Limited bandwidth

For production use, consider upgrading to a paid plan.

---

## 🔐 Security Notes

- Never commit `.env` files with real secrets to GitHub
- Use `.gitignore` to exclude `.env` files
- Set environment variables in Render dashboard, not in code
- For production, use HTTPS (Render provides this automatically)

---

## 📞 Support

If you encounter issues:

1. Check Render's status page: https://status.render.com
2. Review Render documentation: https://render.com/docs
3. Check application logs in Render dashboard
4. Search GitHub issues for similar problems

---

## 🎉 Congratulations!

Your Hospital Queue Management System is now deployed! 🏥

Users can access it from anywhere without needing to run it locally.

---

**Need help?** 
- Render Support: support@render.com
- Check the logs in your Render dashboard for detailed error messages
