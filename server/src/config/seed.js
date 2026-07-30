const { QueueModel } = require('../models/Queue');
const { CounterModel } = require('../models/Counter');

const DEFAULT_DEPARTMENTS = [
  { department: 'General', avgWaitTime: 10 },
  { department: 'Cardiology', avgWaitTime: 15 },
  { department: 'Neurology', avgWaitTime: 20 },
  { department: 'Orthopedics', avgWaitTime: 12 }
];

const DEFAULT_COUNTERS = [
  { counterId: 'counter1', counterNumber: 1, department: 'General', doctorName: 'Dr. Sarah Jenkins', status: 'idle' },
  { counterId: 'counter2', counterNumber: 2, department: 'Cardiology', doctorName: 'Dr. Michael Chen', status: 'idle' },
  { counterId: 'counter3', counterNumber: 3, department: 'Neurology', doctorName: 'Dr. Elena Rostova', status: 'idle' },
  { counterId: 'counter4', counterNumber: 4, department: 'Orthopedics', doctorName: 'Dr. James Wilson', status: 'idle' }
];

const seedDatabase = async () => {
  try {
    // Seed Queues if empty
    const queueCount = await QueueModel.countDocuments();
    if (queueCount === 0) {
      console.log('🌱 Seeding MongoDB with default OPD queues...');
      await QueueModel.insertMany(DEFAULT_DEPARTMENTS);
      console.log('✅ Default OPD queues created in MongoDB.');
    }

    // Seed Counters if empty
    const counterCount = await CounterModel.countDocuments();
    if (counterCount === 0) {
      console.log('🌱 Seeding MongoDB with default doctor counters...');
      await CounterModel.insertMany(DEFAULT_COUNTERS);
      console.log('✅ Default doctor counters created in MongoDB.');
    }
  } catch (error) {
    console.error('❌ Error during MongoDB database seeding:', error.message);
  }
};

module.exports = seedDatabase;
