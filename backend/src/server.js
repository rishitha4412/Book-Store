import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';

import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure Environment Variables (Refreshed on SMTP profile updates)
dotenv.config({ path: path.join(__dirname, '../.env') });

// Handle synchronous uncaught exceptions globally
process.on('uncaughtException', (err) => {
  logger.error('UNCAUGHT EXCEPTION! Server shutting down gracefully...', err);
  process.exit(1);
});

// Establish MongoDB Connection
connectDB();

const PORT = process.env.PORT || 5000;

// Start Server Listeners
const server = app.listen(PORT, () => {
  logger.info(`Express Server running on port ${PORT} in [${process.env.NODE_ENV}] mode.`);
});

// Handle asynchronous promise rejections globally
process.on('unhandledRejection', (err) => {
  logger.error('UNHANDLED REJECTION! Server shutting down gracefully...', err);
  server.close(() => {
    process.exit(1);
  });
});

// Handle system termination signals gracefully
const gracefulShutdown = (signal) => {
  logger.warn(`${signal} signal received. Closing HTTP server and database connections.`);
  
  server.close(() => {
    logger.info('HTTP server closed.');
    mongoose.connection.close(false).then(() => {
      logger.info('Database connection closed.');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
