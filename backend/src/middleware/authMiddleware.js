import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Protect middleware to secure private API endpoints
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Retrieve access token from Authorization Header or signed HTTP Only Cookies
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.signedCookies && req.signedCookies.access_token) {
      token = req.signedCookies.access_token;
    }

    if (!token) {
      return next(
        new AppError('You are not logged in! Please log in to gain access.', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // 2. Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists in database
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return next(
        new AppError('The user belonging to this session token no longer exists.', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // 4. Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! Please log in again.', HTTP_STATUS.UNAUTHORIZED)
      );
    }

    // 5. Grant access by storing user details in request context
    req.user = currentUser;
    next();
  } catch (error) {
    // Forward JWT expiration or signature verification failures to centralized error middleware
    next(error);
  }
};

// Restrict access based on user role
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    // req.user is set by the protect middleware executed beforehand
    if (!req.user || !roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', HTTP_STATUS.FORBIDDEN)
      );
    }
    next();
  };
};
