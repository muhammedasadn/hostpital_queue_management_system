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

### Deploy to Render

Your application is ready to deploy to Render! We've prepared everything for you.

**Quick Start:**
1. Push code to GitHub
2. Go to https://render.com → New → Blueprint
3. Select your repository
4. Click "Create New Blueprint"

**Deployment Documentation:**
- ⭐ **Start Here**: [RENDER_STEP_BY_STEP.md](./RENDER_STEP_BY_STEP.md) - Detailed guide
- **Quick Way**: [RENDER_QUICK_START.md](./RENDER_QUICK_START.md) - 5-minute guide
- **Reference**: [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md) - Complete guide
- **Checklist**: [RENDER_DEPLOYMENT_CHECKLIST.md](./RENDER_DEPLOYMENT_CHECKLIST.md) - Verification
- **Architecture**: [RENDER_ARCHITECTURE.md](./RENDER_ARCHITECTURE.md) - How it works
- **Quick Ref**: [RENDER_QUICK_REFERENCE.md](./RENDER_QUICK_REFERENCE.md) - Reference card

**Key Files Created:**
- `render.yaml` - Deployment configuration
- `.env.example` - Environment template
- `client/.env.example` - Frontend environment template

After deployment, your app will be available at:
- Frontend: `https://hospital-queue-client.onrender.com`
- Backend: `https://hospital-queue-server.onrender.com`

## Deployment Configuration

The system is configured for deployment on Render:

**Backend Service:**
- Runs `npm install && npm start` in the `server` folder
- Uses environment variables for production CORS
- Port: 5000

**Frontend Service:**
- Runs `npm run build` then `serve -s build -l 3000` in the `client` folder
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
