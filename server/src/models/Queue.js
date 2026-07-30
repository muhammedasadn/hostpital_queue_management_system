const mongoose = require('mongoose');

// Mongoose Schema for MongoDB persistence
const QueueSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
    unique: true
  },
  avgWaitTime: {
    type: Number,
    default: 10
  },
  activeTokensCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const QueueModel = mongoose.models.Queue || mongoose.model('Queue', QueueSchema);

// In-memory Queue Class for Fallback Mode
class QueueClass {
  constructor(department) {
    this._id = department.toLowerCase().replace(/\s+/g, '-');
    this.department = department;
    this.tokens = [];
    this.avgWaitTime = 10;
    this.createdAt = new Date();
  }

  addToken(token) {
    this.tokens.push(token);
  }

  removeToken(tokenId) {
    this.tokens = this.tokens.filter(t => t._id !== tokenId && t.tokenId !== tokenId);
  }

  getWaitingTokens() {
    return this.tokens.filter(t => t.status === 'waiting');
  }

  updateAvgWaitTime(time) {
    this.avgWaitTime = time;
  }
}

module.exports = {
  QueueModel,
  QueueClass
};
