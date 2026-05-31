# Hospital Queue Management System

A real-time hospital queue management system built with React (frontend) and Node.js (backend) with Socket.IO for live updates.

## Features

- **Patient Token Booking**: Patients can book a token with their name and department
- **Real-Time Queue Status**: Live queue status with real-time updates
- **QR Code Generation**: Generate QR codes for tokens
- **Admin Dashboard**: Counters can call next token and manage queues
- **Socket.IO Integration**: Real-time communication between client and server

## Project Structure

```
hospital-queue-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # Reusable components
│   │   ├── api/           # API calls
│   │   ├── socket.js      # Socket.IO setup
│   │   └── App.jsx        # Main app component
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Route controllers
│   │   ├── services/      # Business logic services
│   │   ├── config/        # Configuration files
│   │   ├── socket.js      # Socket.IO setup
│   │   └── app.js         # Express app
│   ├── server.js          # Server entry point
│   └── package.json
│
└── README.md
```

## Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

```bash
cd server
npm install
npm start
# or for development with auto-reload
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
npm start
```

The client will run on `http://localhost:3000`

## API Endpoints

### Queues
- `GET /api/queues` - Get all queues
- `GET /api/counters` - Get all counters

### Tokens
- `POST /api/queue/book` - Book a new token
- `GET /api/token/:tokenId` - Get token status

### Counters
- `POST /api/counter/next` - Call next token at counter

## Socket.IO Events

### Client Events
- `tokenBooked` - New token booked
- `tokenCalled` - Token is called at counter
- `queueUpdated` - Queue status updated

## Usage

### Patient Booking
1. Navigate to `http://localhost:3000/`
2. Enter patient name and select department
3. Click "Book Token"
4. QR code will be generated

### Check Queue Status
1. Navigate to `http://localhost:3000/status`
2. View real-time queue status for all departments

### Admin Dashboard
1. Navigate to `http://localhost:3000/admin`
2. View all counters and current tokens
3. Click "Call Next Token" to call the next patient

## Environment Variables

Create a `.env` file in the server directory:

```
PORT=5000
NODE_ENV=development
```

## 🚀 Deployment

Your Hospital Queue Management System is ready to deploy! Choose your option:

### ⭐ **RECOMMENDED: Deploy FREE on Vercel + Railway**

**Cost:** $0 (completely free)
**No Credit Card Required**
**Setup Time:** ~30 minutes

- Frontend on Vercel (lightning fast CDN)
- Backend on Railway (generous free tier)
- Real-time WebSocket communication
- Perfect for hospital queue system

👉 **Guide:** [DEPLOY_VERCEL_RAILWAY.md](./DEPLOY_VERCEL_RAILWAY.md)

**Quick Steps:**
1. Read the guide (10 min)
2. Deploy frontend on Vercel (10 min)
3. Deploy backend on Railway (10 min)
4. Your app is live and FREE! 🎉

---

### Alternative: Deploy on Render (With Billing)

**Cost:** ~$7-15/month (free tier: 15 min spin-down)
**Requires Credit Card**
**Setup Time:** ~15 minutes

- All-in-one platform
- Blueprint automation (easiest setup)
- Great documentation & support

**Guides:**
- Quick: [RENDER_QUICK_START.md](./RENDER_QUICK_START.md)
- Detailed: [RENDER_STEP_BY_STEP.md](./RENDER_STEP_BY_STEP.md)

---

### Compare All Options

See [DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md) for detailed comparison of all deployment platforms.

---

## 📊 Deployment Files

**Environment Templates:**
- `.env.example` - Backend environment
- `client/.env.example` - Frontend environment

**Render Configuration:**
- `render.yaml` - Render deployment blueprint

**Documentation:**
- [DEPLOYMENT_OPTIONS.md](./DEPLOYMENT_OPTIONS.md) - All options explained
- [DEPLOY_VERCEL_RAILWAY.md](./DEPLOY_VERCEL_RAILWAY.md) - Free deployment (RECOMMENDED)
- [RENDER_STEP_BY_STEP.md](./RENDER_STEP_BY_STEP.md) - Render detailed guide
- [RENDER_QUICK_START.md](./RENDER_QUICK_START.md) - Render quick guide
- [RENDER_ARCHITECTURE.md](./RENDER_ARCHITECTURE.md) - How Render works

## Deployment Configuration

The system is configured for multiple deployment platforms:

**Backend Service:**
- Runs `npm install && npm start` in the `server` folder
- Uses environment variables for production CORS
- Port: 5000

**Frontend Service:**
- Runs `npm run build` then serves the built app in the `client` folder
- Uses environment variables for API connections
- Port: 3000

**Environment Variables:**
- Backend: `NODE_ENV`, `PORT`, `FRONTEND_URL`
- Frontend: `REACT_APP_API_URL`, `REACT_APP_SOCKET_URL`

## Technologies Used

### Frontend
- React 18
- Socket.IO Client
- Axios
- QRCode React

### Backend
- Express.js
- Socket.IO
- Node.js

## Future Enhancements

- Database integration (MongoDB)
- SMS notifications using Twilio
- User authentication
- Advanced analytics and reporting
- Mobile app support
- Voice notifications

## License

MIT License

## Support

For issues or questions, please create an issue in the repository.
