# 🏥 Hospital CareQueue Management System

A modern, production-grade **Hospital Queue & Digital Pass Management System** built with **React**, **Node.js / Express**, **Socket.IO**, and **MongoDB (with Stateful In-Memory Fallback)**. Featuring a premium Dark Slate Glassmorphic aesthetic engineered for seamless clinical OPD operations.

---

## ✨ System Highlights

- 🎨 **Dark-Slate Glassmorphic UI**: Custom responsive interface featuring ambient glows, crisp typography (`Outfit`, `Plus Jakarta Sans`), and high-contrast medical accessibility.
- ⚡ **Real-Time Socket.IO Updates**: Instant live queue updates across Patient Portals, Doctor Dispatch Counters, and Public Queue Monitors with zero latency.
- 🛡️ **Cryptographically Secure Tokens**: Unique department token codes (e.g. `GEN-1001`, `CAR-1002`) powered by `crypto.randomUUID()`.
- 💾 **Dual-Storage Persistence**: Full **MongoDB Mongoose** database persistence with automatic **In-Memory Fallback** if MongoDB is offline.
- 📱 **QR Pass Voucher Generation**: Integrated QR pass generation with live status tracking, one-click ID copying, and PNG voucher downloads.
- 👨‍⚕️ **Doctor & Admin Operations**: Real-time patient dispatching, counter queue controls, operational stats, and system-wide reset options.
- 📲 **SMS Notification Engine**: Simulated SMS dispatch service alerting patients when their token is generated or called up by a doctor counter.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router v6, Lucide Icons, Socket.IO Client, Axios, QRCode.react, QR Scanner
- **Backend**: Node.js, Express.js, Socket.IO, Mongoose, Dotenv, Cors
- **Database**: MongoDB (Mongoose Schema) + In-Memory Fallback
- **Deployment Ready**: Configured for Render, Vercel, and Railway

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** (v16.0 or higher)
- **npm** (v8.0 or higher)
- **MongoDB** (Optional - system falls back to in-memory mode if offline)

### Installation & Local Setup

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd hostpital_queue_management_system
   ```

2. **Backend Setup**
   ```bash
   cd server
   npm install
   ```
   *Create a `server/.env` file (optional):*
   ```env
   PORT=5000
   MONGO_URI=mongodb://127.0.0.1:27017/hospital_queue
   FRONTEND_URL=http://localhost:3000
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```
   *(Server will run at `http://localhost:5000`)*

3. **Frontend Setup**
   ```bash
   # In a separate terminal
   cd client
   npm install
   ```
   *Create a `client/.env` file (optional):*
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   REACT_APP_SOCKET_URL=http://localhost:5000
   ```
   Start the React application:
   ```bash
   npm start
   ```
   *(Frontend will open at `http://localhost:3000`)*

---

## 📂 Project Architecture

```
hostpital_queue_management_system/
├── client/                 # React 18 Frontend
│   ├── public/             # Static Assets & Index HTML
│   └── src/
│       ├── api/            # Axios API Service Layer (queueApi.js)
│       ├── components/     # UI Components (QRDisplay, QueueCard, TokenCard)
│       ├── pages/          # Application Pages (Patient, Doctor, Admin)
│       ├── styles/         # Glassmorphic Component CSS Stylesheets
│       ├── App.jsx         # Routes & Navigation Layout
│       ├── index.jsx       # Entry Point
│       └── socket.js       # Real-Time Socket.IO Client Setup
├── server/                 # Express & Socket.IO Backend API
│   ├── server.js           # Main HTTP & Socket Server Entry Point
│   └── src/
│       ├── app.js          # Express Application Middleware & Routes
│       ├── config/         # DB Connection & Seeding Config
│       ├── controllers/    # API Controllers (queueController.js)
│       ├── models/         # Mongoose Models (Queue, Counter, Token)
│       ├── routes/         # Express API Routes (queueRoutes.js)
│       ├── services/       # Business Logic (dataService, tokenService, smsService)
│       └── socket.js       # Real-Time Socket Event Emitter Setup
├── render.yaml             # Render Blueprint Configuration
├── vercel.json             # Vercel Deployment Configuration
└── README.md               # Unified Documentation
```

---

## 🔌 API Endpoints

### Public & Patient Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/queues` | Fetch all active department queues & waiting counts |
| `GET` | `/api/counters` | Fetch doctor counter statuses & current active tokens |
| `GET` | `/api/token/:tokenId` | Retrieve token pass status by ID or formatted token code |
| `POST` | `/api/queue/book` | Book a new patient OPD token pass |

### Doctor & Admin Operations
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/counter/next` | Call next waiting patient token for a doctor counter |
| `POST` | `/api/counter/complete` | Complete active token consultation |
| `GET` | `/api/stats` | Retrieve system-wide queue metrics & statistics |
| `POST` | `/api/queue/reset` | Admin reset for all hospital queues & tokens |

---

## 🌐 Real-Time Socket.IO Events

- `queueUpdated`: Emitted whenever queue status, booking, or call dispatching occurs.
- `tokenBooked`: Emitted on new token registration.
- `tokenCalled`: Emitted when doctor counter calls next patient.
- `tokenCompleted`: Emitted when token visit completes.
- `countersUpdated`: Emitted when doctor counter status changes.

---

## ☁️ Deployment Instructions

### Render Deployment (Recommended)
This repository includes a `render.yaml` blueprint:
1. Push repository to GitHub.
2. Log into **Render** and click **New + -> Blueprint**.
3. Connect your repository. Render will automatically build the client web service and server API service.

### Vercel Deployment (Frontend)
1. Import the repository into **Vercel**.
2. Set build command: `cd client && npm run build`.
3. Set output directory: `client/build`.
4. Configure `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` to point to your live backend server.

---

## 📑 License

Licensed under the MIT License.
