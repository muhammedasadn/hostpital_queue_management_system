const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');
const { verifyToken, requireRole } = require('../middleware/auth');

// Public Queue & Counter Read Routes (Patient Portal & Public Displays)
router.get('/queues', queueController.getQueues);
router.get('/counters', queueController.getCounters);

// Public Patient Token Operations
router.post('/queue/book', queueController.bookToken);
router.get('/token/:tokenId', queueController.getTokenStatus);

// Protected Doctor Counter Dispatch Operations (Doctor / Admin / Reception)
router.post('/counter/next', verifyToken, requireRole('doctor', 'admin', 'reception'), queueController.callNextToken);
router.post('/counter/complete', verifyToken, requireRole('doctor', 'admin', 'reception'), queueController.completeToken);

// Protected Admin Operations
router.get('/stats', verifyToken, requireRole('admin', 'doctor'), queueController.getStats);
router.post('/queue/reset', verifyToken, requireRole('admin'), queueController.resetQueues);

module.exports = router;
