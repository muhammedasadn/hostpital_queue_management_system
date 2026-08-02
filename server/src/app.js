const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api', require('./routes/queueRoutes'));

// Basic Health Check Route
app.get('/', (req, res) => {
  res.json({ message: 'Hospital CareQueue Enterprise API is Active' });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error occurred.' });
});

module.exports = app;
