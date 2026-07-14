class AppError extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.errors = errors;
    this.isOperational = true; // Indicates this is an operational error, not a programming bug

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
