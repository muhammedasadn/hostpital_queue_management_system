// Queue Model (Mock for demonstration)
// In production, use Mongoose schema

class Queue {
  constructor(department) {
    this._id = Math.random().toString();
    this.department = department;
    this.tokens = [];
    this.avgWaitTime = 0;
    this.createdAt = new Date();
  }

  addToken(token) {
    this.tokens.push(token);
  }

  removeToken(tokenId) {
    this.tokens = this.tokens.filter(t => t._id !== tokenId);
  }

  getWaitingTokens() {
    return this.tokens;
  }

  updateAvgWaitTime(time) {
    this.avgWaitTime = time;
  }
}

module.exports = Queue;
