const { getIsConnected } = require('../config/db');
const { QueueModel, QueueClass } = require('../models/Queue');
const { CounterModel, CounterClass } = require('../models/Counter');
const TokenModel = require('../models/Token');
const tokenService = require('./tokenService');

// Stateful In-Memory Fallback Store
const initialDepartments = ['General', 'Cardiology', 'Neurology', 'Orthopedics'];
const memoryStore = {
  queues: initialDepartments.map(dept => new QueueClass(dept)),
  counters: [
    new CounterClass(1, 'General', 'Dr. Sarah Jenkins'),
    new CounterClass(2, 'Cardiology', 'Dr. Michael Chen'),
    new CounterClass(3, 'Neurology', 'Dr. Elena Rostova'),
    new CounterClass(4, 'Orthopedics', 'Dr. James Wilson')
  ],
  tokens: []
};

const dataService = {
  // GET ALL QUEUES
  getQueues: async () => {
    if (getIsConnected()) {
      try {
        const mongoQueues = await QueueModel.find().lean();
        const mongoTokens = await TokenModel.find({ status: { $ne: 'completed' } }).lean();

        return initialDepartments.map(dept => {
          const deptTokens = mongoTokens.filter(t => t.department === dept);
          const queueDoc = mongoQueues.find(q => q.department === dept);
          return {
            _id: queueDoc ? queueDoc._id : dept.toLowerCase(),
            department: dept,
            tokens: deptTokens,
            avgWaitTime: queueDoc ? queueDoc.avgWaitTime : 10,
            createdAt: queueDoc ? queueDoc.createdAt : new Date()
          };
        });
      } catch (err) {
        console.error('MongoDB Error fetching queues, falling back to memory:', err.message);
      }
    }

    return memoryStore.queues;
  },

  // GET ALL COUNTERS
  getCounters: async () => {
    if (getIsConnected()) {
      try {
        const dbCounters = await CounterModel.find().lean();
        if (dbCounters.length > 0) return dbCounters;
      } catch (err) {
        console.error('MongoDB Error fetching counters, falling back to memory:', err.message);
      }
    }

    return memoryStore.counters;
  },

  // BOOK TOKEN
  bookToken: async (patientName, department, phoneNumber = '') => {
    const formattedTokenNumber = tokenService.generateTokenCode(department);
    const tokenId = tokenService.generateSecureUUID();

    let tokenObj = {
      _id: tokenId,
      tokenId: tokenId,
      tokenNumber: formattedTokenNumber,
      sequenceNumber: tokenService.getNextSequence(),
      patientName,
      department,
      phoneNumber,
      status: 'waiting',
      counterId: null,
      position: 1,
      bookedAt: new Date()
    };

    if (getIsConnected()) {
      try {
        const createdToken = await TokenModel.create(tokenObj);
        const waitingCount = await TokenModel.countDocuments({ department, status: 'waiting' });
        tokenObj.position = waitingCount;
        return createdToken.toObject();
      } catch (err) {
        console.error('MongoDB Error saving token, using memory store:', err.message);
      }
    }

    // In-memory store logic
    let queue = memoryStore.queues.find(q => q.department.toLowerCase() === department.toLowerCase());
    if (!queue) {
      queue = new QueueClass(department);
      memoryStore.queues.push(queue);
    }

    tokenObj.position = queue.tokens.filter(t => t.status === 'waiting').length + 1;
    queue.addToken(tokenObj);
    memoryStore.tokens.push(tokenObj);

    return tokenObj;
  },

  // GET SINGLE TOKEN STATUS
  getTokenStatus: async (tokenId) => {
    if (getIsConnected()) {
      try {
        const mongoToken = await TokenModel.findOne({
          $or: [{ tokenId: tokenId }, { _id: tokenId }, { tokenNumber: tokenId }]
        }).lean();

        if (mongoToken) {
          const waitingBefore = await TokenModel.countDocuments({
            department: mongoToken.department,
            status: 'waiting',
            sequenceNumber: { $lt: mongoToken.sequenceNumber }
          });
          mongoToken.position = waitingBefore + 1;
          return mongoToken;
        }
      } catch (err) {
        console.error('MongoDB Error fetching token status:', err.message);
      }
    }

    // Memory Store lookup
    for (let queue of memoryStore.queues) {
      const token = queue.tokens.find(t => t._id === tokenId || t.tokenId === tokenId || t.tokenNumber === tokenId);
      if (token) {
        const waitingTokens = queue.tokens.filter(t => t.status === 'waiting');
        token.position = waitingTokens.findIndex(t => t._id === token._id) + 1;
        return token;
      }
    }

    return null;
  },

  // CALL NEXT TOKEN
  callNextToken: async (counterId) => {
    if (getIsConnected()) {
      try {
        const counter = await CounterModel.findOne({ counterId }).lean();
        if (counter) {
          const nextToken = await TokenModel.findOneAndUpdate(
            { department: counter.department, status: 'waiting' },
            { status: 'called', counterId: counter.counterId, calledAt: new Date() },
            { sort: { sequenceNumber: 1 }, new: true }
          ).lean();

          if (nextToken) {
            await CounterModel.findOneAndUpdate(
              { counterId },
              { currentToken: nextToken, status: 'active' }
            );
            return { nextToken, counter };
          }
        }
      } catch (err) {
        console.error('MongoDB Error calling next token:', err.message);
      }
    }

    // Memory Store fallback
    const counter = memoryStore.counters.find(c => c._id === counterId || c.counterId === counterId);
    if (!counter) return null;

    const queue = memoryStore.queues.find(q => q.department.toLowerCase() === counter.department.toLowerCase());
    if (queue) {
      const waitingTokens = queue.tokens.filter(t => t.status === 'waiting');
      if (waitingTokens.length > 0) {
        const nextToken = waitingTokens[0];
        nextToken.status = 'called';
        nextToken.counterId = counter._id;
        nextToken.calledAt = new Date();
        counter.setCurrentToken(nextToken);
        return { nextToken, counter };
      }
    }

    return { nextToken: null, counter };
  },

  // COMPLETE TOKEN
  completeToken: async (counterId, tokenId) => {
    if (getIsConnected()) {
      try {
        await TokenModel.findOneAndUpdate(
          { $or: [{ tokenId }, { _id: tokenId }] },
          { status: 'completed', completedAt: new Date() }
        );
        await CounterModel.findOneAndUpdate(
          { counterId },
          { currentToken: null, status: 'idle' }
        );
      } catch (err) {
        console.error('MongoDB Error completing token:', err.message);
      }
    }

    const counter = memoryStore.counters.find(c => c._id === counterId || c.counterId === counterId);
    if (counter) {
      if (counter.currentToken) {
        counter.currentToken.status = 'completed';
      }
      counter.clearCurrentToken();
    }

    for (let queue of memoryStore.queues) {
      queue.removeToken(tokenId);
    }

    return true;
  },

  // RESET ALL QUEUES
  resetQueues: async () => {
    tokenService.resetSequence();

    if (getIsConnected()) {
      try {
        await TokenModel.deleteMany({});
        await CounterModel.updateMany({}, { currentToken: null, status: 'idle' });
      } catch (err) {
        console.error('MongoDB Error resetting queues:', err.message);
      }
    }

    memoryStore.queues = initialDepartments.map(dept => new QueueClass(dept));
    memoryStore.counters.forEach(c => c.clearCurrentToken());
    memoryStore.tokens = [];

    return true;
  }
};

module.exports = dataService;
