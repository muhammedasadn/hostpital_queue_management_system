const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Queue & Counter Read Routes
router.get('/queues', queueController.getQueues);
router.get('/counters', queueController.getCounters);
router.get('/stats', queueController.getStats);

// Token Operations
router.post('/queue/book', queueController.bookToken);
router.get('/token/:tokenId', queueController.getTokenStatus);

// Doctor Counter Dispatch Operations
router.post('/counter/next', queueController.callNextToken);
router.post('/counter/complete', queueController.completeToken);

// Admin Management Operations
router.post('/queue/reset', queueController.resetQueues);

module.exports = router;
