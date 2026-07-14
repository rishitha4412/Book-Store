import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';
import logger from '../utils/logger.js';

// Helper to sign JWTs
const signToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Generates access and refresh tokens for a user session
export const generateTokens = (user) => {
  const accessPayload = { id: user._id, role: user.role };
  const refreshPayload = { id: user._id };

  const accessToken = signToken(
    accessPayload,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || '15m'
  );

  const refreshToken = signToken(
    refreshPayload,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  );

  return { accessToken, refreshToken };
};

// Standard secure cookie configuration options
export const getCookieOptions = (type, rememberMe = false) => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  const options = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    signed: true, // Uses Cookie Parser COOKIE_SECRET signature validation
  };

  if (type === 'refresh') {
    // 7 days or 30 days if Remember Me is checked
    const duration = rememberMe ? 30 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    options.maxAge = duration;
  } else if (type === 'access') {
    // 15 minutes maxAge
    options.maxAge = 15 * 60 * 1000;
  }

  return options;
};

// Register user profile and dispatch verification token
export const registerUser = async (name, email, password) => {
  // 1. Check if user already exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new AppError('Email address is already registered', HTTP_STATUS.CONFLICT);
  }

  // 2. Create user (password hashed in Mongoose pre-save hook)
  const newUser = new User({
    name,
    email: email.toLowerCase(),
    password,
  });

  await newUser.save();

  // Remove password from returning object
  newUser.password = undefined;
  return newUser;
};

// Login user: validates credentials and returns tokens
export const loginUser = async (email, password) => {
  // 1. Fetch user including password field (disabled in queries by default)
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  
  if (!user || !(await user.comparePassword(password, user.password))) {
    throw new AppError('Invalid email or password', HTTP_STATUS.UNAUTHORIZED);
  }

  // 2. Generate JWTs
  const { accessToken, refreshToken } = generateTokens(user);

  // Remove password from output profile
  user.password = undefined;
  return { user, accessToken, refreshToken };
};

// Forgot Password: creates reset token and dispatches email recovery link
export const requestPasswordReset = async (email, originUrl = 'http://localhost:5173') => {
  const user = await User.findOne({ email: email.toLowerCase() });
  
  // Return success anyway to avoid user enumeration attacks
  if (!user) {
    logger.info(`Password reset request received for non-existent email: ${email}`);
    return;
  }

  const resetToken = user.createPasswordResetToken();
  await user.save();

  const resetUrl = `${originUrl}/reset-password/${resetToken}`;
  const html = emailTemplates.getPasswordResetHTML(user.name, resetUrl);

  try {
    await sendEmail({
      to: user.email,
      subject: 'Reset your BookStore Password',
      html,
    });
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    throw new AppError('Error sending the email. Try again later.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
};

// Reset password: changes credentials with active reset token
export const resetUserPassword = async (plainToken, newPassword) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(plainToken)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError('Password reset token is invalid or has expired.', HTTP_STATUS.BAD_REQUEST);
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return user;
};

// Verifies Refresh token and mints a fresh Access token
export const refreshUserSession = async (refreshToken) => {
  if (!refreshToken) {
    throw new AppError('Refresh token not provided', HTTP_STATUS.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new AppError('The user belonging to this token no longer exists.', HTTP_STATUS.UNAUTHORIZED);
    }

    const { accessToken } = generateTokens(user);
    return accessToken;
  } catch (error) {
    throw new AppError('Invalid or expired refresh token', HTTP_STATUS.UNAUTHORIZED);
  }
};

// Update user details (profile details/avatar)
export const updateUserProfile = async (userId, updateData) => {
  const { name, email, avatar } = updateData;
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User not found', HTTP_STATUS.NOT_FOUND);
  }

  if (name) user.name = name.trim();
  if (email) {
    // Check if new email conflicts with another user
    if (email.toLowerCase().trim() !== user.email) {
      const emailConflict = await User.findOne({ email: email.toLowerCase().trim() });
      if (emailConflict) {
        throw new AppError('Email address is already in use by another user', HTTP_STATUS.CONFLICT);
      }
      user.email = email.toLowerCase().trim();
    }
  }
  if (avatar) user.avatar = avatar.trim();

  await user.save();
  user.password = undefined;
  return user;
};
