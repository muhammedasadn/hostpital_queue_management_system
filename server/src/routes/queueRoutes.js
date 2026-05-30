const express = require('express');
const router = express.Router();
const queueController = require('../controllers/queueController');

// Queue routes
router.get('/queues', queueController.getQueues);
router.get('/counters', queueController.getCounters);

// Token routes
router.post('/queue/book', queueController.bookToken);
router.get('/token/:tokenId', queueController.getTokenStatus);

// Counter routes
router.post('/counter/next', queueController.callNextToken);

module.exports = router;
