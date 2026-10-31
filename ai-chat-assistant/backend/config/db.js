const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ai-chat-assistant';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    isConnected = true;
    console.log(` MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Failed: ${error.message}`);
    console.warn(`ℹ️ Operating with in-memory persistence fallback mode enabled for offline development.`);
    isConnected = false;
  }
};

const getDBStatus = () => isConnected;

module.exports = { connectDB, getDBStatus };
