# Hospital Queue Management System - Setup Guide

## Quick Start

This guide will help you set up and run the Hospital Queue Management System without any errors or confusion.

---

## Prerequisites

Before starting, make sure you have the following installed on your system:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** (optional, for cloning repositories)

### Check Installation

Open your terminal/command prompt and run:

```bash
node --version
npm --version
```

You should see version numbers for both.

---

## Installation Steps

### Method 1: Automatic Installation (Recommended)

If you're on Mac or Linux:

```bash
chmod +x install.sh
./install.sh
```

### Method 2: Manual Installation

#### Step 1: Install Server Dependencies

```bash
cd server
npm install
cd ..
```

#### Step 2: Install Client Dependencies

```bash
cd client
npm install
cd ..
```

---

## Running the Application

### Step 1: Start the Backend Server

Open a terminal and navigate to the server directory:

```bash
cd server
npm start
```

You should see:
```
Server running on port 5000
```

### Step 2: Start the Frontend Client

Open another terminal (keep the first one running) and navigate to the client directory:

```bash
cd client
npm start
```

The application will automatically open in your default browser at `http://localhost:3000`

---

## Application URLs

Once both are running, you can access:

| Feature | URL |
|---------|-----|
| Patient Booking | http://localhost:3000/ |
| Queue Status | http://localhost:3000/status |
| Admin Dashboard | http://localhost:3000/admin |
| Backend API | http://localhost:5000/api |

---

## Features to Test

### 1. Patient Booking
- Go to http://localhost:3000/
- Enter a patient name
- Select a department (General, Cardiology, Neurology, Orthopedics)
- Click "Book Token"
- You'll get a token number and QR code

### 2. Queue Status
- Go to http://localhost:3000/status
- You'll see real-time queues for all departments
- Status updates automatically when tokens are booked

### 3. Admin Dashboard
- Go to http://localhost:3000/admin
- View all counters and current tokens
- Click "Call Next Token" to simulate calling the next patient

---

## Troubleshooting

### Port Already in Use

If you get an error that port 5000 (server) or 3000 (client) is already in use:

**For Server (port 5000):**
```bash
# Find the process using port 5000
lsof -i :5000
# Kill the process
kill -9 <PID>
```

**For Client (port 3000):**
```bash
# Find the process using port 3000
lsof -i :3000
# Kill the process
kill -9 <PID>
```

### npm install fails

Try clearing npm cache:
```bash
npm cache clean --force
npm install
```

### Can't connect to server from client

Make sure:
1. Server is running on port 5000
2. Client is running on port 3000
3. Both are running in separate terminal windows
4. Check firewall settings

---

## Development Mode

### Using Nodemon (Auto-reload on changes)

For the server, you can use nodemon for automatic restart on file changes:

```bash
cd server
npm run dev
```

This watches for changes and automatically restarts the server.

---

## Project Structure

```
hospital-queue-management-system/
│
├── client/                    # React Frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── api/              # API communication
│   │   ├── App.jsx           # Main App component
│   │   ├── socket.js         # Socket.IO configuration
│   │   ├── index.jsx         # Entry point
│   │   └── index.css         # Styles
│   ├── public/
│   │   └── index.html        # HTML template
│   └── package.json
│
├── server/                    # Node.js Backend
│   ├── src/
│   │   ├── models/           # Data models
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route controllers
│   │   ├── services/         # Business logic
│   │   ├── config/           # Configuration
│   │   ├── socket.js         # Socket.IO setup
│   │   └── app.js            # Express app
│   ├── server.js             # Server entry point
│   ├── .env                  # Environment variables
│   ├── .gitignore            # Git ignore rules
│   ├── package.json          # Dependencies
│   └── nodemon.json          # Nodemon config
│
├── .gitignore
├── install.sh                # Installation script
├── SETUP_GUIDE.md            # This file
└── README.md                 # Project documentation
```

---

## Available Dependencies

### Frontend (Client)
- React 18 - UI Framework
- React Router - Page navigation
- Axios - HTTP requests
- Socket.IO Client - Real-time communication
- QRCode React - QR code generation

### Backend (Server)
- Express.js - Web framework
- Socket.IO - Real-time communication
- Nodemon - Auto-restart on changes
- CORS - Cross-origin requests
- Dotenv - Environment variables

---

## Stopping the Application

To stop either the server or client, press `Ctrl+C` in the respective terminal window.

---

## Next Steps

1. Explore the codebase
2. Understand the API endpoints
3. Modify components and styles
4. Add new features
5. Deploy to production

---

## Support & Resources

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **Socket.IO Docs**: https://socket.io
- **Node.js Docs**: https://nodejs.org/docs

---

## Notes

- This is a demonstration project with mock data
- In production, you would connect to a real database (MongoDB, PostgreSQL, etc.)
- Implement proper authentication and authorization
- Add SMS notifications integration
- Implement error handling and validation

---

**Happy Coding! 🎉**
