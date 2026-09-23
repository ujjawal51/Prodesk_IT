const mongoose = require('mongoose');

/**
 * Sprint 10 Track B - Persistent Storage Connection Manager
 * Interfaces Express server with MongoDB Atlas using Mongoose ODM.
 */
let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    return mongoose.connection;
  }

  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/the_data_hub_sprint10';

  // Mongoose connection options
  const options = {
    serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of hanging
    socketTimeoutMS: 45000,
  };

  try {
    const conn = await mongoose.connect(mongoUri, options);
    isConnected = true;

    console.log(`\n======================================================`);
    console.log(`🚀 [Sprint 10 Mongoose] MongoDB Connected Successfully!`);
    console.log(`📡 Host: ${conn.connection.host}`);
    console.log(`🗄️  Database: ${conn.connection.name}`);
    console.log(`======================================================\n`);

    // Connection event monitors
    mongoose.connection.on('error', (err) => {
      console.error('❌ [Mongoose Runtime Error]:', err.message);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️  [Mongoose Warning]: Database connection disconnected.');
      isConnected = false;
    });

    return conn;
  } catch (error) {
    console.error(`\n❌ [MongoDB Connection Error]: ${error.message}`);
    console.error(`💡 Sprint 10 FAQ 3 Troubleshoot:`);
    console.error(`   1. Ensure MongoDB Atlas Network Access allows your IP (0.0.0.0/0 for testing).`);
    console.error(`   2. Verify MONGO_URI in .env has correct username, password, and database name.`);
    console.error(`   3. If testing offline, ensure local mongod service is running at 127.0.0.1:27017.\n`);
    
    // In test environment or offline demo, allow caller to handle or mock
    if (process.env.NODE_ENV === 'test') {
      throw error;
    }
  }
};

const disconnectDB = async () => {
  if (isConnected) {
    await mongoose.disconnect();
    isConnected = false;
    console.log('🔌 Disconnected from MongoDB');
  }
};

module.exports = { connectDB, disconnectDB };
