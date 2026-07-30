# 🏥 CareQueue Hospital Management System — Setup & Execution Guide

Welcome to the **CareQueue Hospital Queue Management System**. This guide provides step-by-step instructions to set up, configure, run, and test the full application (Node.js/Express Backend + React Frontend + Socket.IO Real-time Engine + Dual Database Architecture).

---

## 📋 System Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: `v16.0.0` or higher (`node -v`)
- **npm**: `v8.0.0` or higher (`npm -v`)
- *(Optional)* **MongoDB**: Local MongoDB instance or MongoDB Atlas URI. 
  > 💡 **Note**: If MongoDB is not installed or unreachable, the system automatically falls back to **Stateful In-Memory Storage Mode** without crashing.

---

## 🛠️ Project Structure Overview

```
hostpital_queue_management_system/
├── server/                 # Express Backend API & Socket.IO Server
│   ├── src/
│   │   ├── config/         # Database connection & Fallback logic
│   │   ├── controllers/    # API Request Handlers
│   │   ├── models/         # Mongoose & In-Memory Data Models
│   │   ├── routes/         # REST API Routes
│   │   └── services/       # Token, SMS & Data Abstraction Services
│   ├── .env.example        # Server Environment Template
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
└── HOW_TO_RUN.md           # This execution guide
```

---

## ⚙️ Step 1: Environment Setup

### 1. Backend Configuration (`server/`)
Navigate to the `server` directory and check/create the `.env` file:
```bash
cd server
```

Create or verify `.env`:
```env
PORT=5000
FRONTEND_URL=http://localhost:3000
# Optional: Set MongoDB Atlas or local URI below.
# If omitted or invalid, the app gracefully runs in Stateful In-Memory Mode.
MONGO_URI=mongodb://localhost:27017/hospital_queue
```

### 2. Frontend Configuration (`client/`)
Navigate to the `client` directory and check/create the `.env` file:
```bash
cd ../client
```

Create or verify `.env`:
```env
PORT=3000
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📦 Step 2: Install Dependencies

From the project root directory, install dependencies for both `server` and `client`:

```bash
# Install Server Dependencies
cd server
npm install

# Install Client Dependencies
cd ../client
npm install
```

---

## 🚀 Step 3: Run the Application

### Option A: Run Server & Client Simultaneously (Recommended)

#### 1. Start the Backend API Server:
In terminal 1:
```bash
cd server
npm run dev
# Or: node server.js
```
*Expected Output:*
```text
🚀 Hospital CareQueue Server running on port 5000
✅ MongoDB Connected: localhost (or ⚠️ Falling back to Stateful In-Memory Mode)
```

#### 2. Start the React Frontend:
In terminal 2:
```bash
cd client
npm start
```
*The web browser will automatically open at `http://localhost:3000`.*

---

## 🧪 Step 4: Testing & Multi-Tab Real-time Demonstration

1. **Open Patient Token Booking**:
   - Navigate to `http://localhost:3000/patient-booking` (or click *Book Token*).
   - Select a department (e.g. `General OPD` or `Cardiology`), enter patient name (e.g. *John Doe*), and submit.
   - You will see a generated **CareQueue Digital Voucher Pass** with a cryptographically secure token ID (e.g., `GEN-1001`) and interactive QR code.

2. **Open Doctor & Queue Monitors in Separate Tabs**:
   - Open Tab A: `http://localhost:3000/doctor-dashboard`
   - Open Tab B: `http://localhost:3000/status` (Live Queue Monitor)
   - Click **"Call Next Patient"** on the Doctor Dashboard.
   - **Observe Real-time Socket.IO Syncing**: Tab B immediately updates the live token status to `CALLED` without refreshing the page!

3. **Admin Operational Control**:
   - Navigate to `http://localhost:3000/admin-dashboard`.
   - Monitor active doctor counters, dispatch statistics, and reset clinical queues for the day.

---

## 📡 API Reference Endpoint Cheat Sheet

| HTTP Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/queues` | Returns all clinical OPD queues and waiting patients |
| `GET` | `/api/counters` | Returns status of all doctor consultation counters |
| `GET` | `/api/stats` | Returns real-time metrics (total waiting, active counters) |
| `POST` | `/api/queue/book` | Registers a patient token pass (`patientName`, `department`, `phoneNumber`) |
| `GET` | `/api/token/:tokenId` | Fetches status and live queue position of a token pass |
| `POST` | `/api/counter/next` | Dispatches next waiting patient to specified doctor counter (`counterId`) |
| `POST` | `/api/counter/complete` | Marks current token completed (`counterId`, `tokenId`) |
| `POST` | `/api/queue/reset` | Resets all hospital queues for a new session |

---

## 🏗️ Step 5: Production Build

To test or build the client production bundle:
```bash
cd client
npm run build
```
The optimized HTML/CSS/JS files will be generated in `client/build/`.

---

## 🛡️ Troubleshooting & FAQs

- **Q: What happens if I don't have MongoDB installed?**
  - **A**: The backend automatically detects MongoDB absence, logs a helpful warning, and runs in **Stateful In-Memory Storage Mode**. All API endpoints and Socket.IO features work completely!

- **Q: Port 5000 or 3000 is already in use?**
  - **A**: Change `PORT=5001` in `server/.env` and update `REACT_APP_API_URL=http://localhost:5001/api` in `client/.env`.

- **Q: Are QR Codes scannable?**
  - **A**: Yes! Every token pass generates a high-contrast QR code containing the token ID URL, scannable by smartphones or the built-in webcam scanner on `http://localhost:3000/check`.
