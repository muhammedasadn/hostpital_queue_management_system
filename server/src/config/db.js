const mongoose = require("mongoose");
const seedDatabase = require("./seed");

let isConnected = false;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hospital_queue";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    
    // Seed default OPD queues and doctor counters
    await seedDatabase();

    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    isConnected = false;
    throw error;
  }
};

const getIsConnected = () => isConnected;

module.exports = { connectDB, getIsConnected };