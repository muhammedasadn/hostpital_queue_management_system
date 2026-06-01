const Queue = require('../models/Queue');
const Counter = require('../models/Counter');

// In-memory database with mock data
const database = {
  queues: [
    new Queue('Cardiology'),
    new Queue('Neurology'),
    new Queue('Orthopedics'),
    new Queue('General Medicine'),
    new Queue('Dermatology')
  ],
  counters: [
    new Counter(1, 'Cardiology'),
    new Counter(2, 'Cardiology'),
    new Counter(3, 'Neurology'),
    new Counter(4, 'Orthopedics'),
    new Counter(5, 'General Medicine'),
    new Counter(6, 'Dermatology')
  ],
  tokenCounter: 1000,

  incrementTokenCounter() {
    return ++this.tokenCounter;
  }
};

module.exports = database;
