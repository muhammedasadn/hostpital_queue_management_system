const app = require('./src/app');
const http = require('http');
const socketIO = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);

// Get frontend URL from environment
const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

const io = socketIO(server, {
  cors: {
    origin: frontendUrl,
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Make io accessible to routes
app.set('io', io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
