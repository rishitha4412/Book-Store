import mongoose from 'mongoose';
import logger from '../utils/logger.js';

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    logger.error('MONGODB_URI is not defined in the environment variables.');
    process.exit(1);
  }

  // Event handlers for tracking DB states
  mongoose.connection.on('connected', () => {
    logger.info('Successfully connected to MongoDB database.');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB database connection error:', err);
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB database connection disconnected.');
  });

  try {
    // Optional connection parameters in Mongoose 6+ (autoIndex, serverSelectionTimeoutMS, etc.)
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds if connection fails
    });
  } catch (error) {
    logger.error('Initial MongoDB database connection failure:', error);
    process.exit(1);
  }
};

export default connectDB;
