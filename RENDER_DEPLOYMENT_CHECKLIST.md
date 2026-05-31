# Render Deployment Checklist

Complete this checklist before and after deploying to Render.

## ✅ Pre-Deployment Checklist

### Code Preparation
- [ ] All code changes committed to GitHub
- [ ] No uncommitted changes
- [ ] `.env` files added to `.gitignore` (not committed)
- [ ] All dependencies in `package.json`
- [ ] No hardcoded localhost URLs (use environment variables)
- [ ] `render.yaml` file exists in root directory

### Backend Setup (server folder)
- [ ] `server/package.json` has correct start script: `node server.js`
- [ ] `server/server.js` uses `process.env.PORT`
- [ ] `server/server.js` uses `process.env.FRONTEND_URL` for CORS
- [ ] All required packages listed in `dependencies`

### Frontend Setup (client folder)
- [ ] `client/package.json` has build script: `react-scripts build`
- [ ] `client/src/api/queueApi.js` uses `process.env.REACT_APP_API_URL`
- [ ] `client/src/socket.js` uses `process.env.REACT_APP_SOCKET_URL`
- [ ] Build completes without errors locally: `npm run build`

### Documentation
- [ ] `render.yaml` file created ✓
- [ ] `.env.example` files created ✓
- [ ] `RENDER_DEPLOYMENT_GUIDE.md` created ✓

---

## 🚀 Deployment Steps

- [ ] Created Render account (https://render.com)
- [ ] Pushed code to GitHub
- [ ] Created Blueprint or manually set up services
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Backend URL available (e.g., `https://hospital-queue-server.onrender.com`)
- [ ] Frontend URL available (e.g., `https://hospital-queue-client.onrender.com`)

---

## ✅ Post-Deployment Verification

### Backend Tests
- [ ] Backend service shows "Live" status in Render dashboard
- [ ] Can access backend health check: `https://your-backend.onrender.com/health` (if implemented)
- [ ] Check logs for any errors: Dashboard → Service → Logs
- [ ] Environment variables are set correctly

### Frontend Tests
- [ ] Frontend service shows "Live" status in Render dashboard
- [ ] Frontend URL loads without errors
- [ ] Role selection page displays correctly
- [ ] Check browser console for errors (F12)
- [ ] Network tab shows API requests to backend URL

### Functionality Tests
- [ ] Click "Patient" role - patient dashboard loads
- [ ] Click "Doctor" role - doctor dashboard loads
- [ ] Book token works (check network tab)
- [ ] WebSocket connects (check console for socket connection message)
- [ ] Check token status works
- [ ] Real-time updates work (if testing with multiple tabs)

### Common Issues to Check
- [ ] CORS errors in console → Check `FRONTEND_URL` in backend
- [ ] API errors (404, 503) → Check `REACT_APP_API_URL` in frontend
- [ ] WebSocket connection failures → Check `REACT_APP_SOCKET_URL` in frontend
- [ ] Build failures → Check logs and ensure all dependencies are listed

---

## 🔄 After Deployment

- [ ] Bookmark the frontend URL
- [ ] Update any documentation with production URLs
- [ ] Monitor logs regularly for errors
- [ ] Plan database integration if needed
- [ ] Consider upgrading from free tier for production use
- [ ] Set up error tracking (optional)

---

## 📝 Important Reminders

**Environment Variables to Set:**

**Backend:**
```
NODE_ENV = production
PORT = 5000
FRONTEND_URL = https://your-frontend-url.onrender.com
```

**Frontend:**
```
REACT_APP_API_URL = https://your-backend-url.onrender.com/api
REACT_APP_SOCKET_URL = https://your-backend-url.onrender.com
```

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `render.yaml` has correct `buildCommand` |
| Can't connect to API | Verify `REACT_APP_API_URL` env var in frontend service |
| CORS errors | Update backend `FRONTEND_URL` to actual frontend URL |
| Service crashes | Check logs in Render dashboard for error messages |
| Data not persisting | This is expected - add MongoDB for persistence |

---

## 📞 Need Help?

- 📖 Read: `RENDER_DEPLOYMENT_GUIDE.md`
- 🚀 Quick Start: `RENDER_QUICK_START.md`
- 🔗 Render Docs: https://render.com/docs
- 📧 Render Support: support@render.com

---

**Successfully deployed?** 🎉 Your Hospital Queue Management System is now live!
