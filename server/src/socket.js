const socketIO = require('socket.io');

let io = null;

const initializeSocket = (server) => {
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

  io = socketIO(server, {
    cors: {
      origin: [frontendUrl, 'http://localhost:3000', 'http://127.0.0.1:3000'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {
    console.log(`📡 Socket connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

const getIO = () => {
  if (!io) {
    console.warn('⚠️ Socket.IO accessed before initialization');
  }
  return io;
};

const emitQueueEvent = (eventName, payload) => {
  if (io) {
    io.emit(eventName, payload);
  }
};

module.exports = { initializeSocket, getIO, emitQueueEvent };
