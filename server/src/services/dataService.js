const mongoose = require('mongoose');
const { QueueModel } = require('../models/Queue');
const { CounterModel } = require('../models/Counter');
const TokenModel = require('../models/Token');
const tokenService = require('./tokenService');
const seedDatabase = require('../config/seed');

// Patient Data Anonymization Helper (HIPAA Privacy Compliance)
const anonymizeToken = (tokenObj) => {
  if (!tokenObj) return null;
  const nameParts = (tokenObj.patientName || '').trim().split(' ');
  const maskedName = nameParts.map(p => p ? `${p[0]}***` : '').join(' ');
  const phone = tokenObj.phoneNumber || '';
  const maskedPhone = phone.length > 4 ? `${phone.slice(0, 3)}****${phone.slice(-2)}` : '';

  return {
    ...tokenObj,
    patientName: maskedName || 'Patient',
    phoneNumber: maskedPhone
  };
};

const dataService = {
  // GET ALL QUEUES WITH ANONYMIZED ACTIVE TOKENS (PUBLIC VIEW)
  getQueues: async () => {
    const dbQueues = await QueueModel.find().lean();
    const activeTokens = await TokenModel.find({ status: { $in: ['waiting', 'called'] } }).sort({ sequenceNumber: 1 }).lean();

    return dbQueues.map(queue => {
      const departmentTokens = activeTokens
        .filter(t => t.department.toLowerCase() === queue.department.toLowerCase())
        .map((t, idx) => anonymizeToken({ ...t, position: idx + 1 }));

      return {
        _id: queue._id,
        department: queue.department,
        tokens: departmentTokens,
        avgWaitTime: queue.avgWaitTime || 10,
        createdAt: queue.createdAt || new Date()
      };
    });
  },

  // GET ALL DOCTOR COUNTERS (PUBLIC ANONYMIZED VIEW)
  getCounters: async () => {
    const counters = await CounterModel.find().sort({ counterNumber: 1 }).lean();
    return counters.map(c => ({
      ...c,
      currentToken: c.currentToken ? anonymizeToken(c.currentToken) : null
    }));
  },

  // BOOK A NEW PATIENT TOKEN
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

    const waitingBefore = await TokenModel.countDocuments({
      department: department,
      status: 'waiting',
      sequenceNumber: { $lt: nextSeq }
    });

    const tokenObj = savedToken.toObject();
    tokenObj.position = waitingBefore + 1;
    tokenObj._id = savedToken.tokenId;

    return tokenObj;
  },

  // GET SINGLE TOKEN STATUS (ANONYMIZED FOR PUBLIC ACCESS)
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
    return anonymizeToken(token);
  },

  // CALL NEXT TOKEN FOR DOCTOR COUNTER (RETURNS FULL PATIENT RECORD FOR AUTHENTICATED DOCTOR)
  callNextToken: async (counterId) => {
    const isObjectId = mongoose.Types.ObjectId.isValid(counterId);
    const counterQuery = isObjectId
      ? { $or: [{ counterId: counterId }, { _id: counterId }] }
      : { counterId: counterId };

    const counter = await CounterModel.findOne(counterQuery);

    if (!counter) return null;

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

    return { nextToken: null, counter: counter.toObject() };
  },

  // COMPLETE TOKEN
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
    
    await TokenModel.deleteMany({});
    await CounterModel.updateMany({}, { currentToken: null, status: 'idle' });
    await seedDatabase();

    return true;
  }
};

module.exports = dataService;
