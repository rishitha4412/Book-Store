import HTTP_STATUS from '../constants/httpStatusCodes.js';
import logger from '../utils/logger.js';

// Helper to handle Mongoose invalid IDs (CastError)
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return { message, statusCode: HTTP_STATUS.BAD_REQUEST };
};

// Helper to handle Mongoose duplicate unique fields (MongoServerError: 11000)
const handleDuplicateFieldsDB = (err) => {
  // Extract duplicate value from err message
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : '';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return { message, statusCode: HTTP_STATUS.CONFLICT };
};

// Helper to handle Mongoose validation failures
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(' ')}`;
  return { message, statusCode: HTTP_STATUS.BAD_REQUEST, errors };
};

// Helper to handle invalid JWT signatures
const handleJWTError = () => ({
  message: 'Invalid token. Please log in again.',
  statusCode: HTTP_STATUS.UNAUTHORIZED,
});

// Helper to handle expired JWTs
const handleJWTExpiredError = () => ({
  message: 'Your token has expired! Please log in again.',
  statusCode: HTTP_STATUS.UNAUTHORIZED,
});

// Developer Response: Output stack trace and full error information
const sendErrorDev = (err, res) => {
  res.status(err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: err.message,
    errors: err.errors || [],
    stack: err.stack,
    error: err,
  });
};

// Production Response: Hide internal details, return user-friendly info
const sendErrorProd = (err, res) => {
  const statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;

  // 1. Operational, trusted error: send user-friendly message to client
  if (err.isOperational) {
    return res.status(statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || [],
    });
  }

  // 2. Programming or unknown error: do not leak details, log to file
  logger.error('CRITICAL UNHANDLED ERROR:', err);
  
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Something went wrong on the server. Please try again later.',
    errors: [],
  });
};

// Main centralized error handling middleware
const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  err.status = err.status || 'error';

  const env = process.env.NODE_ENV || 'development';

  if (env === 'development') {
    sendErrorDev(err, res);
  } else if (env === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.stack = err.stack;

    // Handle known MongoDB and Mongoose errors
    if (err.name === 'CastError') {
      const dbErr = handleCastErrorDB(err);
      error.message = dbErr.message;
      error.statusCode = dbErr.statusCode;
      error.isOperational = true;
    }
    
    if (err.code === 11000) {
      const dbErr = handleDuplicateFieldsDB(err);
      error.message = dbErr.message;
      error.statusCode = dbErr.statusCode;
      error.isOperational = true;
    }

    if (err.name === 'ValidationError') {
      const dbErr = handleValidationErrorDB(err);
      error.message = dbErr.message;
      error.statusCode = dbErr.statusCode;
      error.errors = dbErr.errors;
      error.isOperational = true;
    }

    // Handle JWT authorization errors
    if (err.name === 'JsonWebTokenError') {
      const jwtErr = handleJWTError();
      error.message = jwtErr.message;
      error.statusCode = jwtErr.statusCode;
      error.isOperational = true;
    }

    if (err.name === 'TokenExpiredError') {
      const jwtErr = handleJWTExpiredError();
      error.message = jwtErr.message;
      error.statusCode = jwtErr.statusCode;
      error.isOperational = true;
    }

    sendErrorProd(error, res);
  }
};

export default errorMiddleware;
