// Mock database for demonstration
// In production, replace with actual MongoDB connection

let queues = [
  {
    _id: '1',
    department: 'General',
    tokens: [],
    avgWaitTime: 0
  },
  {
    _id: '2',
    department: 'Cardiology',
    tokens: [],
    avgWaitTime: 0
  },
  {
    _id: '3',
    department: 'Neurology',
    tokens: [],
    avgWaitTime: 0
  },
  {
    _id: '4',
    department: 'Orthopedics',
    tokens: [],
    avgWaitTime: 0
  }
];

let counters = [
  {
    _id: 'counter1',
    counterNumber: 1,
    currentToken: null,
    department: 'General'
  },
  {
    _id: 'counter2',
    counterNumber: 2,
    currentToken: null,
    department: 'Cardiology'
  },
  {
    _id: 'counter3',
    counterNumber: 3,
    currentToken: null,
    department: 'Neurology'
  },
  {
    _id: 'counter4',
    counterNumber: 4,
    currentToken: null,
    department: 'Orthopedics'
  }
];

let tokenCounter = 0;

module.exports = {
  queues,
  counters,
  tokenCounter,
  incrementTokenCounter: () => ++tokenCounter
};
