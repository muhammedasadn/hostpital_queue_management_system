// Counter Model (Mock for demonstration)
// In production, use Mongoose schema

class Counter {
  constructor(counterNumber, department) {
    this._id = `counter${counterNumber}`;
    this.counterNumber = counterNumber;
    this.department = department;
    this.currentToken = null;
    this.createdAt = new Date();
  }

  setCurrentToken(token) {
    this.currentToken = token;
  }

  clearCurrentToken() {
    this.currentToken = null;
  }

  getCurrentToken() {
    return this.currentToken;
  }
}

module.exports = Counter;
