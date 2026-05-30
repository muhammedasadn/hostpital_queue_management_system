# Quick Start Reference

## Installation (One Time)

```bash
# Install all dependencies
chmod +x install.sh
./install.sh

# OR manually:
cd server && npm install && cd ..
cd client && npm install && cd ..
```

## Running the Application

### Terminal 1 - Start Server
```bash
cd server
npm start
# Server runs on http://localhost:5000
```

### Terminal 2 - Start Client
```bash
cd client
npm start
# Client runs on http://localhost:3000
```

## Access Points

| Feature | URL |
|---------|-----|
| **Patient Booking** | http://localhost:3000/ |
| **Queue Status** | http://localhost:3000/status |
| **Admin Dashboard** | http://localhost:3000/admin |
| **API Base URL** | http://localhost:5000/api |

## API Endpoints

```
GET    /api/queues              - Get all queues
GET    /api/counters            - Get all counters
POST   /api/queue/book          - Book a token
GET    /api/token/:tokenId      - Get token status
POST   /api/counter/next        - Call next token
```

## Development Commands

```bash
# Server with auto-reload
cd server
npm run dev

# Run tests (if configured)
cd client
npm test
```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5000 in use | `lsof -i :5000` then `kill -9 <PID>` |
| Port 3000 in use | `lsof -i :3000` then `kill -9 <PID>` |
| npm install fails | `npm cache clean --force` then retry |
| Can't connect | Ensure both servers are running |

## Project Structure

```
hospital-queue-management-system/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/         # Page components
│   │   ├── components/    # UI components
│   │   ├── api/           # API calls
│   │   └── App.jsx        # Main component
│   └── package.json
├── server/                # Node.js Backend
│   ├── src/
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   ├── controllers/   # Controllers
│   │   └── services/      # Business logic
│   └── package.json
└── README.md
```

## Stop Application

Press `Ctrl+C` in either terminal

---

**For detailed setup, see SETUP_GUIDE.md**
