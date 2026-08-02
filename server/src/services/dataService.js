const mongoose = require('mongoose');
const { QueueModel } = require('../models/Queue');
const { CounterModel } = require('../models/Counter');
const TokenModel = require('../models/Token');
const tokenService = require('./tokenService');
const seedDatabase = require('../config/seed');

const dataService = {
  // GET ALL QUEUES WITH ACTIVE TOKENS FROM MONGODB
  getQueues: async () => {
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
    tokenObj._id = savedToken.tokenId; // Clean alias for client

    return tokenObj;
  },

  // GET TOKEN STATUS FROM MONGODB
  getTokenStatus: async (tokenId) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(tokenId);
    const query = isObjectId 
      ? { $or: [{ tokenId: tokenId }, { tokenNumber: tokenId }, { _id: tokenId }] }
      : { $or: [{ tokenId: tokenId }, { tokenNumber: tokenId }] };

    const token = await TokenModel.findOne(query).lean();

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
    const isObjectId = mongoose.Types.ObjectId.isValid(counterId);
    const counterQuery = isObjectId
      ? { $or: [{ counterId: counterId }, { _id: counterId }] }
      : { counterId: counterId };

    const counter = await CounterModel.findOne(counterQuery);

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
    const isTokenObjectId = mongoose.Types.ObjectId.isValid(tokenId);
    const tokenQuery = isTokenObjectId
      ? { $or: [{ tokenId: tokenId }, { tokenNumber: tokenId }, { _id: tokenId }] }
      : { $or: [{ tokenId: tokenId }, { tokenNumber: tokenId }] };

    await TokenModel.findOneAndUpdate(
      tokenQuery,
      { status: 'completed', completedAt: new Date() }
    );

    const isCounterObjectId = mongoose.Types.ObjectId.isValid(counterId);
    const counterQuery = isCounterObjectId
      ? { $or: [{ counterId: counterId }, { _id: counterId }] }
      : { counterId: counterId };

    const counter = await CounterModel.findOne(counterQuery);

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
