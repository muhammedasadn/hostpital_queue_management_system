const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public Login Route
router.post('/login', authController.login);

// Protected Profile Route
router.get('/me', verifyToken, authController.getMe);

// Admin-Only Staff Registration Route
router.post('/register-staff', verifyToken, requireRole('admin'), authController.registerStaff);

module.exports = router;
