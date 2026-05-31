# Hospital Queue System - Render Deployment Architecture

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         RENDER PLATFORM                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────┐        ┌──────────────────────┐     │
│  │  Frontend Service    │        │  Backend Service     │     │
│  │ (React Application)  │        │  (Express API)       │     │
│  │                      │        │                      │     │
│  │ - hospital-queue-    │        │ - hospital-queue-    │     │
│  │   client             │        │   server             │     │
│  │ - Port: 3000         │◄──────►│ - Port: 5000         │     │
│  │ - Build: npm build   │ HTTP   │ - Start: npm start   │     │
│  │ - Start: serve       │ /API   │ - Runtime: Node      │     │
│  │ - Runtime: Node      │        │                      │     │
│  │                      │        │                      │     │
│  └──────────────────────┘        └──────────────────────┘     │
│           ▲                                   ▲                │
│           │ HTTPS                            │ PORT 5000      │
│           │ :3000                            │                │
│           │                                  │                │
└───────────┼──────────────────────────────────┼────────────────┘
            │                                  │
    ┌───────┴──────────────┐           ┌──────┴─────────────┐
    │                      │           │                    │
    │   User's Browser     │           │  Database (Future) │
    │  (Patient or Doctor) │           │  - MongoDB         │
    │                      │           │  - Data Persistence│
    │   - Web App UI       │           │  - Queue Data      │
    │   - Real-time Updates│           │  - Tokens          │
    │   - WebSocket        │           │  - Counters        │
    │                      │           │                    │
    └──────────────────────┘           └────────────────────┘
```

---

## 📊 Deployment Flow

### 1. Development Phase
```
Your Computer
    ↓
    ├─ Write Code
    ├─ Test Locally (localhost:3000 & localhost:5000)
    └─ Commit to Git
            ↓
        GitHub Repository
```

### 2. Deployment Phase
```
GitHub Repository (main branch)
    ↓
Render Blueprint Detection
    ├─ Reads render.yaml
    ├─ Identifies 2 services
    └─ Triggers deployment
        ↓
    ┌────────────────────┬────────────────────┐
    ↓                    ↓
Backend Service       Frontend Service
(Express API)         (React App)
    ↓                    ↓
npm install           npm install
npm run build         npm run build
npm start             serve -s build
    ↓                    ↓
http://localhost:5000 http://localhost:3000
    ↓                    ↓
Gets Render URL       Gets Render URL
    ↓                    ↓
Set env vars          Set env vars
    ↓                    ↓
Ready for Use! ◄─────► Live!
```

### 3. Runtime Phase
```
User opens Frontend URL
    ↓
Browser loads React App
    ↓
Frontend connects to Backend via API
    ├─ API Endpoint: /api/queues
    ├─ API Endpoint: /api/queue/book
    └─ WebSocket: /socket.io
    ↓
Real-time Communication
    ├─ Book Token → API Request
    ├─ Response ← Backend
    └─ WebSocket Update → All Connected Users
    ↓
User sees live updates!
```

---

## 🔄 Data Flow

### Patient Books a Token
```
1. User enters name + department
   ↓
2. Frontend sends POST request
   - URL: https://hospital-queue-server.onrender.com/api/queue/book
   - Data: {patientName, department}
   ↓
3. Backend receives request
   - Creates token
   - Saves to database
   - Emits WebSocket event
   ↓
4. Frontend receives response
   - Shows confirmation
   - Saves to localStorage
   - Updates display
   ↓
5. Doctor dashboard receives WebSocket event
   - Updates queue view
   - Shows new patient
```

### Doctor Calls Next Patient
```
1. Doctor clicks "Call Next Patient"
   ↓
2. Frontend sends POST request
   - URL: https://hospital-queue-server.onrender.com/api/counter/next
   - Data: {counterId}
   ↓
3. Backend updates queue
   - Removes patient from queue
   - Updates counter
   - Emits WebSocket event
   ↓
4. All connected patients receive update
   - Real-time WebSocket message
   - Show current serving token
   - Update position
```

---

## 🔗 Environment Variable Connections

### Build Time
```
render.yaml
    ↓
Reads render.yaml configuration
    ├─ Backend settings
    ├─ Frontend settings
    └─ Environment variables
    ↓
For Frontend:
    REACT_APP_API_URL=https://...backend.../api
    ↓
    Injected into React build
    ↓
    npm run build
    ↓
    Built JS contains actual API URL
```

### Runtime
```
Environment Variables Set in Render
    ├─ Backend
    │  ├─ NODE_ENV=production
    │  ├─ PORT=5000
    │  └─ FRONTEND_URL=https://...frontend...
    │
    └─ Frontend
       ├─ REACT_APP_API_URL=https://...backend.../api
       └─ REACT_APP_SOCKET_URL=https://...backend...
    ↓
Application reads variables
    ├─ Backend: Sets CORS to allow FRONTEND_URL
    └─ Frontend: Uses API_URL for requests
    ↓
Services communicate successfully!
```

---

## 🌐 Network Architecture

```
Internet
    │
    ├─ DNS Lookup: hospital-queue-client.onrender.com
    │
    └─► Render Global Network
            │
            ├─► Region: US East
            │       │
            │       ├─ Frontend Service (Node.js)
            │       │  └─ React App (port 3000)
            │       │
            │       └─ Backend Service (Node.js)
            │          └─ Express API (port 5000)
            │
            └─ All requests go through Render's CDN
                (HTTPS encrypted)
```

---

## 📈 Request/Response Cycle

### API Request Example
```
Browser (User)
    ↓ (HTTPS POST)
    │ URL: https://hospital-queue-client.onrender.com
    │
    ├─────────────────────────────────────────→ Render Network
                                               │
                                        Frontend Service
                                               │ (React handles routing)
                                               │
                                        Makes API call to:
                                     https://hospital-queue-server.onrender.com/api/queues
                                               │
                                        Backend Service
                                        (Express processes)
                                               │
                                        Returns JSON
                                               │
    ←─────────────────────────────────────────
    │ (Response back through Render)
    │
    ↓
React updates UI
Display queues to user
```

---

## 🔐 Security Architecture

```
┌─ HTTPS Encrypted (Render provides SSL/TLS)
│
├─ Render Firewall
│  └─ DDoS Protection
│  └─ Request Rate Limiting
│
├─ CORS Configuration
│  └─ Backend only accepts from known frontend URL
│  └─ Prevents unauthorized API access
│
├─ Environment Variables
│  └─ Secrets not in code
│  └─ No credentials in GitHub
│
└─ Isolation
   └─ Each service runs separately
   └─ Cannot directly access file systems
```

---

## 📊 Service Communication

### Direct Communication (HTTP)
```
Frontend → API Request → Backend
Frontend ← JSON Response ← Backend
```

### Real-time Communication (WebSocket)
```
Frontend ← WebSocket Connection → Backend
    │                               │
    ├─ Subscribe to events         │
    │ (tokenBooked, tokenCalled)   │
    │                               │
    ├─ Send events                 │
    │ (callNext, bookToken)        │
    │                               │
    └─ Receive updates in real-time
```

---

## 🎯 Deployment Architecture Summary

```
┌─────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT ARCHITECTURE                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  GitHub Repository                                          │
│  └─ render.yaml defines infrastructure-as-code            │
│                                                             │
│  Render Platform (Orchestration)                           │
│  ├─ Service 1: Backend (Express)                          │
│  │  └─ Handles API requests                               │
│  │  └─ Manages WebSocket                                  │
│  │  └─ CORS configured                                    │
│  │                                                         │
│  ├─ Service 2: Frontend (React)                           │
│  │  └─ User interface                                     │
│  │  └─ Client-side routing                                │
│  │  └─ Real-time updates                                  │
│  │                                                         │
│  └─ Environment Variables (Linking)                       │
│     └─ Services know how to find each other              │
│                                                             │
│  CDN & Global Network                                      │
│  └─ Fast delivery to users worldwide                       │
│                                                             │
│  SSL/TLS Encryption (HTTPS)                               │
│  └─ All data encrypted in transit                         │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Update & Redeploy Cycle

```
1. Make Changes
   └─ Update code locally
   └─ Test (npm start)

2. Commit & Push
   └─ git add .
   └─ git commit -m "message"
   └─ git push origin main

3. Automatic Detection
   └─ Render webhook triggers
   └─ GitHub notifies Render

4. Build & Deploy
   └─ Pull latest code
   └─ Run build commands
   └─ Start services
   └─ Update DNS

5. Live in Production
   └─ ~2-5 minutes after push
   └─ Zero downtime (usually)

6. Monitor
   └─ Check logs
   └─ Verify functionality
```

---

## 📱 User Experience Flow

```
Patient User Journey:
1. Opens: hospital-queue-client.onrender.com
2. Sees: Role selection page
3. Clicks: "Patient" button
4. Uses: Patient dashboard
5. Books: Token for department
6. Monitors: Queue position in real-time
7. Gets: Called when near counter

Doctor User Journey:
1. Opens: same URL
2. Clicks: "Doctor / Staff" button
3. Sees: Doctor dashboard
4. Views: All queues
5. Manages: Patient flow
6. Updates: Queue status
7. All patients see: Updates in real-time
```

---

## ✅ Architecture Checklist

- ✅ Two separate services (Frontend + Backend)
- ✅ Proper environment variable configuration
- ✅ CORS properly configured for production
- ✅ WebSocket real-time communication
- ✅ HTTPS encrypted traffic
- ✅ Auto-redeploy on GitHub push
- ✅ Scalable infrastructure
- ✅ Monitoring and logging available

---

## 📈 Future Enhancement Points

```
Current Architecture:
Frontend ◄──► Backend ◄──► Memory Database
(Client)       (Server)    (Not persistent)

Enhanced Architecture:
Frontend ◄──► Backend ◄──► MongoDB
(Client)       (Server)    (Persistent)
                   │
                   ├─ Redis (Caching)
                   ├─ SMS Service (Twilio)
                   └─ Email Service
```

---

## 🎓 Key Concepts

| Term | Meaning |
|------|---------|
| **render.yaml** | Infrastructure-as-code defining services |
| **Service** | Independent application instance |
| **Environment Variable** | Configuration value available to app |
| **Build Command** | Command run before starting service |
| **Start Command** | Command that starts the service |
| **CORS** | Security policy for cross-origin requests |
| **WebSocket** | Real-time bidirectional communication |
| **HTTPS** | Encrypted web communication |
| **DNS** | Maps domain name to IP address |

---

**This architecture ensures your Hospital Queue System is scalable, secure, and maintainable in production!** 🚀
