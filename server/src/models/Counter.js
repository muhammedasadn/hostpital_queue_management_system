const mongoose = require('mongoose');

// Mongoose Schema for MongoDB persistence
const CounterSchema = new mongoose.Schema({
  counterId: {
    type: String,
    required: true,
    unique: true
  },
  counterNumber: {
    type: Number,
    required: true
  },
  department: {
    type: String,
    required: true
  },
  doctorName: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['active', 'idle', 'closed'],
    default: 'idle'
  },
  currentToken: {
    type: Object,
    default: null
  }
}, { timestamps: true });

const CounterModel = mongoose.models.Counter || mongoose.model('Counter', CounterSchema);

// In-Memory Counter Class for Fallback Mode
class CounterClass {
  constructor(counterNumber, department, doctorName = '') {
    this._id = `counter${counterNumber}`;
    this.counterId = `counter${counterNumber}`;
    this.counterNumber = counterNumber;
    this.department = department;
    this.doctorName = doctorName || `Dr. Counter ${counterNumber}`;
    this.status = 'idle';
    this.currentToken = null;
    this.createdAt = new Date();
  }

  setCurrentToken(token) {
    this.currentToken = token;
    this.status = token ? 'active' : 'idle';
  }

  clearCurrentToken() {
    this.currentToken = null;
    this.status = 'idle';
  }
}

module.exports = {
  CounterModel,
  CounterClass
};
