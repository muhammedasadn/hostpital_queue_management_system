const dataService = require('../services/dataService');
const smsService = require('../services/smsService');
const { emitQueueEvent } = require('../socket');

// GET ALL QUEUES
const getQueues = async (req, res) => {
  try {
    const queues = await dataService.getQueues();
    res.json(queues);
  } catch (error) {
    console.error('Error in getQueues:', error);
    res.status(500).json({ error: 'Failed to fetch queues' });
  }
};

// GET ALL COUNTERS
const getCounters = async (req, res) => {
  try {
    const counters = await dataService.getCounters();
    res.json(counters);
  } catch (error) {
    console.error('Error in getCounters:', error);
    res.status(500).json({ error: 'Failed to fetch counters' });
  }
};

// BOOK A TOKEN
const bookToken = async (req, res) => {
  try {
    const { patientName, department, phoneNumber } = req.body;

    if (!patientName || !patientName.trim()) {
      return res.status(400).json({ error: 'Patient full name is required' });
    }
    if (!department || !department.trim()) {
      return res.status(400).json({ error: 'Department selection is required' });
    }

    const token = await dataService.bookToken(patientName.trim(), department.trim(), phoneNumber || '');

    // Send SMS notification
    if (phoneNumber) {
      smsService.sendTokenNotification(phoneNumber, token.tokenNumber, department);
    }

    // Broadcast Socket Event
    emitQueueEvent('tokenBooked', token);
    emitQueueEvent('queueUpdated', { department });

    res.status(201).json(token);
  } catch (error) {
    console.error('Error in bookToken:', error);
    res.status(500).json({ error: 'Failed to register token' });
  }
};

// GET SINGLE TOKEN STATUS
const getTokenStatus = async (req, res) => {
  try {
    const { tokenId } = req.params;
    if (!tokenId) {
      return res.status(400).json({ error: 'Token ID or Number is required' });
    }

    const token = await dataService.getTokenStatus(tokenId);
    if (!token) {
      return res.status(404).json({ error: 'Token pass not found' });
    }

    res.json(token);
  } catch (error) {
    console.error('Error in getTokenStatus:', error);
    res.status(500).json({ error: 'Failed to retrieve token status' });
  }
};

// CALL NEXT TOKEN FOR COUNTER
const callNextToken = async (req, res) => {
  try {
    const { counterId } = req.body;
    if (!counterId) {
      return res.status(400).json({ error: 'Counter ID is required' });
    }

    const result = await dataService.callNextToken(counterId);
    if (!result || !result.counter) {
      return res.status(404).json({ error: 'Doctor counter not found' });
    }

    const { nextToken, counter } = result;

    if (nextToken) {
      // Send SMS alert if phone exists
      if (nextToken.phoneNumber) {
        smsService.sendCalledNotification(nextToken.phoneNumber, nextToken.tokenNumber, counter.counterNumber);
      }

      // Broadcast Socket Event
      emitQueueEvent('tokenCalled', { token: nextToken, counter });
      emitQueueEvent('queueUpdated', { department: counter.department });

      return res.json({ success: true, token: nextToken, counter });
    }

    res.json({ success: false, message: 'No waiting patients in queue for this department', counter });
  } catch (error) {
    console.error('Error in callNextToken:', error);
    res.status(500).json({ error: 'Failed to dispatch next token' });
  }
};

// COMPLETE TOKEN
const completeToken = async (req, res) => {
  try {
    const { counterId, tokenId } = req.body;
    if (!counterId || !tokenId) {
      return res.status(400).json({ error: 'counterId and tokenId are required' });
    }

    await dataService.completeToken(counterId, tokenId);

    // Broadcast Socket Event
    emitQueueEvent('tokenCompleted', { counterId, tokenId });
    emitQueueEvent('queueUpdated', {});

    res.json({ success: true, message: 'Token marked completed' });
  } catch (error) {
    console.error('Error in completeToken:', error);
    res.status(500).json({ error: 'Failed to complete token' });
  }
};

// RESET QUEUES
const resetQueues = async (req, res) => {
  try {
    await dataService.resetQueues();

    emitQueueEvent('queueUpdated', {});
    emitQueueEvent('countersUpdated', {});

    res.json({ success: true, message: 'All hospital queues have been reset' });
  } catch (error) {
    console.error('Error resetting queues:', error);
    res.status(500).json({ error: 'Failed to reset queues' });
  }
};

// GET SYSTEM STATS
const getStats = async (req, res) => {
  try {
    const queues = await dataService.getQueues();
    const counters = await dataService.getCounters();

    const totalWaiting = queues.reduce((acc, q) => acc + (q.tokens ? q.tokens.filter(t => t.status === 'waiting').length : 0), 0);
    const activeCounters = counters.filter(c => c.status === 'active').length;

    res.json({
      totalWaiting,
      activeCounters,
      totalDepartments: queues.length,
      totalCounters: counters.length,
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ error: 'Failed to fetch system stats' });
  }
};

module.exports = {
  getQueues,
  getCounters,
  bookToken,
  getTokenStatus,
  callNextToken,
  completeToken,
  resetQueues,
  getStats
};
