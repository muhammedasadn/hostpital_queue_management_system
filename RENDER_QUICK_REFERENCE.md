# 🚀 Render Deployment - Quick Reference Card

Print or bookmark this for quick reference!

---

## ⚡ FASTEST DEPLOYMENT (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Render deployment"
git push origin main
```

### 2. Create Blueprint on Render
- Go to https://dashboard.render.com
- Click **New → Blueprint**
- Select repository
- Click **Create New Blueprint**

### 3. Done!
- Backend URL: `https://hospital-queue-server.onrender.com`
- Frontend URL: `https://hospital-queue-client.onrender.com`

---

## 🔐 ENVIRONMENT VARIABLES TO SET

**Backend Service:**
```
NODE_ENV = production
PORT = 5000
FRONTEND_URL = https://hospital-queue-client.onrender.com
```

**Frontend Service:**
```
REACT_APP_API_URL = https://hospital-queue-server.onrender.com/api
REACT_APP_SOCKET_URL = https://hospital-queue-server.onrender.com
```

---

## 🐛 TROUBLESHOOTING

| Error | Fix |
|-------|-----|
| CORS Error | Update `FRONTEND_URL` in backend env vars |
| Can't connect to API | Check `REACT_APP_API_URL` in frontend |
| Service won't start | Check logs: Service → Logs in dashboard |
| Build fails | Check package.json for missing dependencies |
| WebSocket fails | Check `REACT_APP_SOCKET_URL` env var |

---

## 📁 FILES CREATED

- `render.yaml` - Service configuration
- `.env.example` - Environment template
- `client/.env.example` - Frontend env template
- `RENDER_STEP_BY_STEP.md` - Detailed guide ⭐
- `RENDER_QUICK_START.md` - Fast guide
- `RENDER_DEPLOYMENT_GUIDE.md` - Full reference
- `RENDER_DEPLOYMENT_CHECKLIST.md` - Verification
- `RENDER_ARCHITECTURE.md` - How it works
- `RENDER_SETUP_SUMMARY.md` - Setup overview

---

## 📝 FILES MODIFIED

- `server/server.js` - CORS uses env variable
- `client/src/api/queueApi.js` - API URL uses env variable
- `client/src/socket.js` - Socket URL uses env variable
- `client/package.json` - Added `serve` package

---

## 🔗 USEFUL LINKS

- **Render Dashboard**: https://dashboard.render.com
- **Render Docs**: https://render.com/docs
- **Socket.IO Docs**: https://socket.io/docs
- **GitHub**: https://github.com

---

## ✅ VERIFICATION CHECKLIST

After deployment:
- [ ] Both services show "Live" status
- [ ] Frontend page loads
- [ ] Patient dashboard works
- [ ] Doctor dashboard works
- [ ] Book token works
- [ ] WebSocket connected (check console)
- [ ] No error messages

---

## 📊 SERVICE DETAILS

```
Backend Service:
- Name: hospital-queue-server
- Runtime: Node.js
- Build: cd server && npm install
- Start: npm start
- Port: 5000

Frontend Service:
- Name: hospital-queue-client
- Runtime: Node.js
- Build: cd client && npm run build
- Start: npx serve -s build -l 3000
- Port: 3000
```

---

## 🌐 URLS AFTER DEPLOYMENT

- **Your App**: https://hospital-queue-client.onrender.com
- **Backend API**: https://hospital-queue-server.onrender.com
- **API Endpoints**: https://hospital-queue-server.onrender.com/api

---

## 💾 IMPORTANT REMINDERS

❌ **Don't forget:**
- Update both env vars after first service deploys
- Backend needs FRONTEND_URL pointing to frontend URL
- Frontend needs REACT_APP_API_URL pointing to backend URL

✅ **Do remember:**
- HTTPS is automatic
- Services spin down after 15 minutes idle (free tier)
- Deployments take 5-10 minutes
- GitHub push auto-triggers redeploy

---

## 📞 HELP

- Read: `RENDER_STEP_BY_STEP.md` (detailed)
- Reference: `RENDER_DEPLOYMENT_GUIDE.md` (comprehensive)
- Checklist: `RENDER_DEPLOYMENT_CHECKLIST.md` (verification)

---

## 🎯 QUICK START

**1 minute summary:**
```
1. git push to GitHub
2. Render Dashboard → New → Blueprint
3. Select repo, click Create
4. Wait 10 minutes
5. Open frontend URL
6. Done! 🎉
```

---

## 🚀 YOU'RE READY TO DEPLOY!

All configuration is complete. Your app is production-ready.

**Next Step:** Follow `RENDER_STEP_BY_STEP.md`

---

**Questions?** Check the documentation files or Render docs at https://render.com/docs
