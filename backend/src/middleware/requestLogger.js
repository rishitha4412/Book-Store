import morgan from 'morgan';
import logger from '../utils/logger.js';

// Pipe morgan log messages directly to our custom logger
const stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

// Choose log format based on current running environment
const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

// Skip logging for health checks to keep logs cleaner (optional, but standard for production)
const skip = (req) => {
  return req.originalUrl === '/api/v1/health';
};

const requestLogger = morgan(format, { stream, skip });

export default requestLogger;
