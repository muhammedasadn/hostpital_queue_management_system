const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

// Connect MongoDB
connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const io = socketIO(server, {
  cors: {
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  },
});

// Make io accessible inside controllers/routes
app.set("io", io);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Test route
app.get("/", (req, res) => {
  res.send("Hospital Queue Management API is running");
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});