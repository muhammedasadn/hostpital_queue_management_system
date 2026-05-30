# Hospital Queue Management System - Complete Structure

## 📁 Project Overview

This is a fully functional Hospital Queue Management System with a React frontend and Node.js backend. All files are pre-configured and ready to run.

---

## 📂 Directory Structure

```
hospital-queue-management-system/
│
├── 📄 README.md                    # Project overview and documentation
├── 📄 SETUP_GUIDE.md               # Detailed setup instructions
├── 📄 QUICK_START.md               # Quick reference guide
├── 📄 PROJECT_STRUCTURE.md         # This file - detailed explanation
├── 📄 .gitignore                   # Git ignore rules
├── 🔧 install.sh                   # Automated installation script
│
├── 📁 client/                      # FRONTEND (React)
│   ├── 📄 package.json             # Frontend dependencies
│   ├── 📄 .gitignore               # Client-specific git rules
│   ├── 📄 public/
│   │   └── 📄 index.html           # HTML entry point
│   │
│   └── 📁 src/                     # Source code
│       ├── 📄 App.jsx              # Main app component with routing
│       ├── 📄 index.jsx            # React entry point
│       ├── 📄 index.css            # Global styles
│       ├── 📄 socket.js            # Socket.IO client setup
│       │
│       ├── 📁 pages/               # Page components
│       │   ├── 📄 PatientBooking.jsx    # Patient token booking page
│       │   ├── 📄 TokenStatus.jsx      # Queue status view page
│       │   └── 📄 AdminDashboard.jsx   # Admin counter management
│       │
│       ├── 📁 components/          # Reusable UI components
│       │   ├── 📄 QueueCard.jsx        # Displays queue information
│       │   ├── 📄 TokenCard.jsx        # Displays token details
│       │   └── 📄 QRDisplay.jsx        # QR code generator
│       │
│       └── 📁 api/                 # API communication
│           └── 📄 queueApi.js      # All API calls to backend
│
├── 📁 server/                      # BACKEND (Node.js)
│   ├── 📄 package.json             # Backend dependencies
│   ├── 📄 .env                     # Environment variables
│   ├── 📄 .gitignore               # Server-specific git rules
│   ├── 📄 nodemon.json             # Auto-reload configuration
│   ├── 📄 server.js                # Server entry point with Socket.IO
│   │
│   └── 📁 src/                     # Source code
│       ├── 📄 app.js               # Express app configuration
│       ├── 📄 socket.js            # Socket.IO server setup
│       │
│       ├── 📁 config/              # Configuration
│       │   └── 📄 db.js            # Mock database & data initialization
│       │
│       ├── 📁 models/              # Data models
│       │   ├── 📄 Queue.js         # Queue model with methods
│       │   └── 📄 Counter.js       # Counter model with methods
│       │
│       ├── 📁 controllers/         # Route controllers
│       │   └── 📄 queueController.js   # All queue logic
│       │
│       ├── 📁 routes/              # API routes
│       │   └── 📄 queueRoutes.js   # All API endpoints
│       │
│       └── 📁 services/            # Business logic
│           ├── 📄 tokenService.js  # Token generation & management
│           └── 📄 smsService.js    # SMS notification service (mock)
```

---

## 📋 File Descriptions

### Root Level Files

| File | Purpose |
|------|---------|
| `README.md` | Main project documentation |
| `SETUP_GUIDE.md` | Step-by-step setup instructions |
| `QUICK_START.md` | Quick reference for commands |
| `PROJECT_STRUCTURE.md` | This file - detailed structure explanation |
| `.gitignore` | Git rules for root level |
| `install.sh` | Automated installation script |

### Client Files

#### Pages (`client/src/pages/`)
- **PatientBooking.jsx** - Allows patients to book tokens with their name and department
- **TokenStatus.jsx** - Shows real-time queue status with Socket.IO updates
- **AdminDashboard.jsx** - Allows counter staff to call next token

#### Components (`client/src/components/`)
- **QueueCard.jsx** - Displays queue info (length, wait time, token list)
- **TokenCard.jsx** - Shows booked token details
- **QRDisplay.jsx** - Generates and downloads QR codes for tokens

#### API (`client/src/api/`)
- **queueApi.js** - Axios wrapper for all backend API calls

#### Core Files
- **App.jsx** - Main app with React Router setup
- **index.jsx** - React app entry point
- **index.css** - Global styling for the entire app
- **socket.js** - Socket.IO client configuration
- **public/index.html** - HTML template

### Server Files

#### Controllers (`server/src/controllers/`)
- **queueController.js** - Handles all queue operations:
  - Get all queues
  - Book a token
  - Get token status
  - Call next token
  - Get counter status

#### Routes (`server/src/routes/`)
- **queueRoutes.js** - Defines all API endpoints:
  - `GET /api/queues` - Get all queues
  - `GET /api/counters` - Get all counters
  - `POST /api/queue/book` - Book a token
  - `GET /api/token/:tokenId` - Get token status
  - `POST /api/counter/next` - Call next token

#### Models (`server/src/models/`)
- **Queue.js** - Queue model with methods:
  - `addToken()` - Add token to queue
  - `removeToken()` - Remove token from queue
  - `getWaitingTokens()` - Get all waiting tokens
  - `updateAvgWaitTime()` - Update average wait time

- **Counter.js** - Counter model with methods:
  - `setCurrentToken()` - Set current token
  - `clearCurrentToken()` - Clear current token
  - `getCurrentToken()` - Get current token

#### Services (`server/src/services/`)
- **tokenService.js** - Token management:
  - `generateTokenNumber()` - Auto-increment token numbers
  - `createToken()` - Create new token object
  - `updateTokenStatus()` - Update token status
  - `calculateWaitTime()` - Calculate wait time

- **smsService.js** - SMS notifications (mock):
  - `sendTokenNotification()` - Notify on booking
  - `sendCalledNotification()` - Notify when called
  - `sendStatusUpdate()` - Send status updates

#### Config (`server/src/config/`)
- **db.js** - Mock database with initial data:
  - 4 departments (General, Cardiology, Neurology, Orthopedics)
  - 4 counters (one per department)
  - Token counter and queue storage

#### Core Files
- **server.js** - Main server entry point with Socket.IO
- **app.js** - Express app setup and middleware
- **socket.js** - Socket.IO server configuration
- **.env** - Environment variables (PORT=5000)
- **nodemon.json** - Auto-reload configuration

---

## 🔄 Data Flow

### Token Booking Flow
```
1. Patient enters name and department in PatientBooking.jsx
2. Form submitted → API call via queueApi.js
3. POST /api/queue/book → queueController.js
4. Token created via tokenService.js
5. Token added to queue in db.js
6. Socket.IO broadcasts 'tokenBooked' event
7. TokenCard displays token details and QR code
8. TokenStatus page updates in real-time
```

### Token Called Flow
```
1. Admin clicks "Call Next Token" in AdminDashboard.jsx
2. API call to POST /api/counter/next
3. queueController removes next token from queue
4. Updates counter's currentToken
5. Socket.IO broadcasts 'tokenCalled' event
6. AdminDashboard and TokenStatus update in real-time
```

---

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.11.0",
  "axios": "^1.4.0",
  "socket.io-client": "^4.7.0",
  "qrcode.react": "^1.0.0",
  "react-scripts": "5.0.1"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "socket.io": "^4.7.0",
  "cors": "^2.8.5",
  "dotenv": "^16.0.3",
  "nodemon": "^2.0.20"
}
```

---

## 🚀 Running the Application

### Installation
```bash
chmod +x install.sh
./install.sh
```

### Start Server (Terminal 1)
```bash
cd server
npm start
```

### Start Client (Terminal 2)
```bash
cd client
npm start
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/queues` | Get all queues |
| GET | `/api/counters` | Get all counters |
| POST | `/api/queue/book` | Book a token |
| GET | `/api/token/:tokenId` | Get token status |
| POST | `/api/counter/next` | Call next token |

---

## 🔌 Socket.IO Events

| Event | Direction | Data | Purpose |
|-------|-----------|------|---------|
| `tokenBooked` | Server → Client | Token object | Notify new token booked |
| `tokenCalled` | Server → Client | Token + Counter | Notify token called |
| `queueUpdated` | Server → Client | Updated queue | Notify queue updated |

---

## 🎯 Key Features

✅ **Patient Token Booking** - Book tokens with name and department
✅ **Real-Time Updates** - Socket.IO for live status updates
✅ **QR Code Generation** - Generate and download QR codes
✅ **Admin Dashboard** - Manage tokens at counters
✅ **Mock Database** - Pre-populated with departments and counters
✅ **Error Handling** - Try-catch blocks and error messages
✅ **Responsive Design** - Mobile-friendly CSS
✅ **Auto-Reload** - Nodemon for development
✅ **CORS Enabled** - Cross-origin requests allowed
✅ **Environment Config** - .env file for configuration

---

## 🔧 Configuration Files

### `.env` (Server)
```
PORT=5000
NODE_ENV=development
```

### `nodemon.json` (Server)
- Watches `src` directory for changes
- Auto-restarts on file changes
- Ignores `src/public` directory

### `package.json` (Both)
- Defines all dependencies
- Setup npm scripts
- Versioning information

---

## 📝 Notes

1. **Mock Database** - Currently using in-memory data (db.js)
   - In production: Use MongoDB, PostgreSQL, etc.

2. **No Authentication** - Admin and patient access are open
   - In production: Add login/authentication

3. **SMS Service** - Currently logs to console
   - In production: Integrate Twilio or similar

4. **Real Database** - For persistence, configure MongoDB:
   - Install MongoDB
   - Replace db.js mock with Mongoose models
   - Update controllers with db queries

---

## ✨ Next Steps

1. **Install Dependencies** - Run `./install.sh`
2. **Start Servers** - Run server and client in separate terminals
3. **Test Features** - Visit http://localhost:3000
4. **Explore Code** - Understand the architecture
5. **Add Features** - Customize for your needs
6. **Deploy** - Use Heroku, AWS, or your preferred platform

---

**All files are pre-configured and ready to use! 🎉**
