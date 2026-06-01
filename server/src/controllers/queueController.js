const db = require('../config/database');

const getQueues = (req, res) => {
  try {
    res.json(db.queues);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch queues' });
  }
};

const bookToken = (req, res) => {
  try {
    const { patientName, department } = req.body;

    if (!patientName || !department) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tokenNumber = db.incrementTokenCounter();
    const token = {
      _id: Math.random().toString(),
      tokenNumber,
      patientName,
      department,
      status: 'waiting',
      bookedAt: new Date(),
      position: 0
    };

    const queue = db.queues.find(q => q.department === department);
    if (queue) {
      queue.addToken(token);
      token.position = queue.tokens.length;
    }

    // Emit socket event
    const io = req.app.get('io');
    if (io) {
      io.emit('tokenBooked', token);
    }

    res.status(201).json(token);
  } catch (error) {
    console.error('Error booking token:', error);
    res.status(500).json({ error: 'Failed to book token' });
  }
};

const getTokenStatus = (req, res) => {
  try {
    const { tokenId } = req.params;

    for (let queue of db.queues) {
      const token = queue.tokens.find(t => t._id === tokenId);
      if (token) {
        token.position = queue.tokens.indexOf(token) + 1;
        return res.json(token);
      }
    }

    res.status(404).json({ error: 'Token not found' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch token status' });
  }
};

const callNextToken = (req, res) => {
  try {
    const { counterId } = req.body;

    const counter = db.counters.find(c => c._id === counterId);
    if (!counter) {
      return res.status(404).json({ error: 'Counter not found' });
    }

    const queue = db.queues.find(q => q.department === counter.department);
    if (queue && queue.tokens.length > 0) {
      const nextToken = queue.tokens.shift();
      counter.currentToken = nextToken;
      nextToken.status = 'called';

      // Emit socket event
      const io = req.app.get('io');
      if (io) {
        io.emit('tokenCalled', { token: nextToken, counter });
      }

      res.json({ success: true, token: nextToken, counter });
    } else {
      res.json({ success: false, message: 'No tokens in queue' });
    }
  } catch (error) {
    console.error('Error calling next token:', error);
    res.status(500).json({ error: 'Failed to call next token' });
  }
};

const getCounters = (req, res) => {
  try {
    res.json(db.counters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch counters' });
  }
};

module.exports = {
  getQueues,
  bookToken,
  getTokenStatus,
  callNextToken,
  getCounters
};
