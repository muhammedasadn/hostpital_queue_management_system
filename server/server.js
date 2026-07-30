const http = require("http");
require("dotenv").config();

const app = require("./src/app");
const { connectDB } = require("./src/config/db");
const { initializeSocket } = require("./src/socket");

// Connect MongoDB (or fallback gracefully to Stateful In-Memory mode)
connectDB();

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;

// Initialize Socket.IO
const io = initializeSocket(server);
app.set("io", io);

// Default Health Route
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "Hospital CareQueue API is active",
    timestamp: new Date()
  });
});

server.listen(PORT, () => {
  console.log(`🚀 Hospital CareQueue Server running on port ${PORT}`);
});