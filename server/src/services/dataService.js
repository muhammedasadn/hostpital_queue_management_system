const { QueueModel } = require('../models/Queue');
const { CounterModel } = require('../models/Counter');
const TokenModel = require('../models/Token');
const tokenService = require('./tokenService');
const seedDatabase = require('../config/seed');

const dataService = {
  // GET ALL QUEUES WITH ACTIVE TOKENS FROM MONGODB
  getQueues: async () => {
    // Ensure queues exist in database
    await seedDatabase();
    
    const dbQueues = await QueueModel.find().lean();
    const activeTokens = await TokenModel.find({ status: { $in: ['waiting', 'called'] } }).sort({ sequenceNumber: 1 }).lean();

    return dbQueues.map(queue => {
      const departmentTokens = activeTokens.filter(t => t.department.toLowerCase() === queue.department.toLowerCase());
      return {
        _id: queue._id,
        department: queue.department,
        tokens: departmentTokens.map((t, idx) => ({ ...t, position: idx + 1 })),
        avgWaitTime: queue.avgWaitTime || 10,
        createdAt: queue.createdAt || new Date()
      };
    });
  },

  // GET ALL DOCTOR COUNTERS FROM MONGODB
  getCounters: async () => {
    await seedDatabase();
    return await CounterModel.find().sort({ counterNumber: 1 }).lean();
  },

  // BOOK A NEW PATIENT TOKEN IN MONGODB
  bookToken: async (patientName, department, phoneNumber = '') => {
    const formattedTokenNumber = tokenService.generateTokenCode(department);
    const tokenId = tokenService.generateSecureUUID();
    const nextSeq = tokenService.getNextSequence();

    const newToken = new TokenModel({
      tokenId: tokenId,
      tokenNumber: formattedTokenNumber,
      sequenceNumber: nextSeq,
      patientName,
      department,
      phoneNumber,
      status: 'waiting',
      counterId: null,
      bookedAt: new Date()
    });

    const savedToken = await newToken.save();

    // Calculate position
    const waitingBefore = await TokenModel.countDocuments({
      department: department,
      status: 'waiting',
      sequenceNumber: { $lt: nextSeq }
    });

    const tokenObj = savedToken.toObject();
    tokenObj.position = waitingBefore + 1;
    tokenObj._id = savedToken.tokenId; // Provide clean _id alias for frontend

    return tokenObj;
  },

  // GET TOKEN STATUS FROM MONGODB
  getTokenStatus: async (tokenId) => {
    const token = await TokenModel.findOne({
      $or: [{ tokenId: tokenId }, { tokenNumber: tokenId }]
    }).lean();

    if (!token) return null;

    if (token.status === 'waiting') {
      const waitingBefore = await TokenModel.countDocuments({
        department: token.department,
        status: 'waiting',
        sequenceNumber: { $lt: token.sequenceNumber }
      });
      token.position = waitingBefore + 1;
    } else {
      token.position = 0;
    }

    token._id = token.tokenId;
    return token;
  },

  // CALL NEXT TOKEN FOR DOCTOR COUNTER IN MONGODB
  callNextToken: async (counterId) => {
    const counter = await CounterModel.findOne({
      $or: [{ counterId: counterId }, { _id: counterId }]
    });

    if (!counter) return null;

    // Atomically find earliest waiting token for this department
    const nextToken = await TokenModel.findOneAndUpdate(
      { department: counter.department, status: 'waiting' },
      { status: 'called', counterId: counter.counterId, calledAt: new Date() },
      { sort: { sequenceNumber: 1 }, new: true }
    );

    if (nextToken) {
      const nextTokenObj = nextToken.toObject();
      nextTokenObj._id = nextTokenObj.tokenId;

      counter.currentToken = nextTokenObj;
      counter.status = 'active';
      await counter.save();

      return { nextToken: nextTokenObj, counter: counter.toObject() };
    }

    // No waiting tokens left for this department
    return { nextToken: null, counter: counter.toObject() };
  },

  // COMPLETE TOKEN IN MONGODB
  completeToken: async (counterId, tokenId) => {
    await TokenModel.findOneAndUpdate(
      { $or: [{ tokenId: tokenId }, { tokenNumber: tokenId }] },
      { status: 'completed', completedAt: new Date() }
    );

    const counter = await CounterModel.findOne({
      $or: [{ counterId: counterId }, { _id: counterId }]
    });

    if (counter) {
      counter.currentToken = null;
      counter.status = 'idle';
      await counter.save();
    }

    return true;
  },

  // RESET ALL QUEUES IN MONGODB
  resetQueues: async () => {
    tokenService.resetSequence();
    
    // Wipe tokens collection
    await TokenModel.deleteMany({});

    // Reset counters to idle
    await CounterModel.updateMany({}, { currentToken: null, status: 'idle' });

    // Re-seed default queues if missing
    await seedDatabase();

    return true;
  }
};

module.exports = dataService;
