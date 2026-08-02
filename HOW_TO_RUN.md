# 🏥 CareQueue Hospital Management System — Setup & Execution Guide

Welcome to the **CareQueue Hospital Queue Management System**. This guide provides step-by-step instructions to set up, configure, run, and test the full application (Node.js/Express Backend + React Frontend + Socket.IO Real-time Engine + Dual Database Architecture).

---

## 📋 System Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v16.0.0` or higher (`node -v`)
- **npm**: `v8.0.0` or higher (`npm -v`)
- **MongoDB**: Local MongoDB instance running on `mongodb://127.0.0.1:27017/hospital_queue`.

---

## 🔐 Administrative & Manual Routing Policy

As requested for enhanced administrative security:
- **No Public Admin Links**: The landing page (`/`) and public navigation header do **not** contain direct links or buttons to the Admin Dashboard.
- **Single Permanent Admin Route**: The Admin Console is accessible strictly via manual URL entry at:
  ```text
  http://localhost:3000/admin
  ```
  *(Any navigation attempts to legacy routes such as `/admin-dashboard` are automatically redirected to `/admin`.)*

---

## 🛠️ Project Structure Overview

```
hostpital_queue_management_system/
├── server/                 # Express Backend API & Socket.IO Server
│   ├── src/
│   │   ├── config/         # MongoDB connection & Seed logic
│   │   ├── controllers/    # API Request Handlers
│   │   ├── models/         # Mongoose Schemas (Token, Queue, Counter)
│   │   ├── routes/         # REST API Routes
│   │   └── services/       # Token, SMS & Pure MongoDB Data Services
│   ├── .env                # Server Environment (MONGO_URI=mongodb://127.0.0.1:27017/hospital_queue)
│   └── server.js           # Server Entrypoint (Port 5000)
│
├── client/                 # React Frontend Application
│   ├── src/
│   │   ├── api/            # Axios API Gateway
│   │   ├── components/     # Reusable Pass & QR UI Components
│   │   ├── pages/          # Dashboards (Patient, Doctor, Admin, Booking)
│   │   └── styles/         # Glassmorphism Dark Theme Stylesheets
│   └── package.json        # Client Dependencies
│
└── HOW_TO_RUN.md           # Execution guide
```

---

## ⚙️ Step 1: Environment Setup

### 1. Backend Configuration (`server/`)
Create or verify `server/.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
MONGO_URI=mongodb://127.0.0.1:27017/hospital_queue
```

### 2. Frontend Configuration (`client/`)
Create or verify `client/.env`:
```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📦 Step 2: Install Dependencies & Run

```bash
# Terminal 1: Run Express Backend
cd server
npm install
npm run dev

# Terminal 2: Run React Frontend
cd client
npm install
npm start
```

---

## 🧪 Step 3: Portal Access & Testing

1. **Patient Booking & Live Queue**:
   - Landing Page: `http://localhost:3000/`
   - Patient Booking: `http://localhost:3000/patient-booking`
   - Live Queues: `http://localhost:3000/status`
   - Check Ticket: `http://localhost:3000/check`

2. **Doctor & Staff Portal**:
   - Doctor Dashboard: `http://localhost:3000/doctor-dashboard`

3. **Admin Portal (Manual URL Entry Only)**:
   - Admin Console: `http://localhost:3000/admin`
   - *Login Credentials*: `admin@carequeue.com` / `Admin@123456`
