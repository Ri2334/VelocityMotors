const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // In test environment, MONGODB_URI will be replaced by the memory server uri in setup.js, 
    // but we use the environment variable as fallback/default.
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/car_dealership';
    const conn = await mongoose.connect(uri);
    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    return conn;
  } catch (error) {
    if (process.env.NODE_ENV === 'test') {
      throw error;
    } else {
      console.error(`Database Connection Error: ${error.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
