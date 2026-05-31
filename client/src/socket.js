import io from 'socket.io-client';

const socketUrl = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

const socket = io(socketUrl, {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5
});

export default socket;
