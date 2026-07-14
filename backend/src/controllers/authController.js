import * as authService from '../services/authService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';
import AppError from '../utils/appError.js';

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    
    const newUser = await authService.registerUser(name, email, password);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Registration successful. Please sign in.',
      data: {
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, rememberMe } = req.body;

    const { user, accessToken, refreshToken } = await authService.loginUser(email, password);

    // Apply tokens in signed cookies for secure cookie architecture
    res.cookie('access_token', accessToken, authService.getCookieOptions('access'));
    res.cookie('refresh_token', refreshToken, authService.getCookieOptions('refresh', rememberMe));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged in successfully',
      data: {
        token: accessToken,
        user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // Clear cookies
    res.clearCookie('access_token', authService.getCookieOptions('access'));
    res.clearCookie('refresh_token', authService.getCookieOptions('refresh'));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Logged out successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};



export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const origin = req.get('origin') || 'http://localhost:5173';
    
    await authService.requestPasswordReset(email, origin);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'If the email exists, a password reset link has been dispatched.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    await authService.resetUserPassword(token, password);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    // Read from signed cookies first, fallback to body or header
    let token = req.signedCookies.refresh_token;

    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Refresh token is missing or expired', HTTP_STATUS.UNAUTHORIZED);
    }

    const newAccessToken = await authService.refreshUserSession(token);

    // Set new access cookie
    res.cookie('access_token', newAccessToken, authService.getCookieOptions('access'));

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Token refreshed successfully',
      data: {
        token: newAccessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req, res, next) => {
  try {
    // req.user is set by the protect middleware
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile fetched successfully',
      data: {
        user: req.user,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateUserProfile(req.user._id, req.body);
    
    // Update local cached cookies or tokens if email changed (optional, cookie automatically holds user ID so no need to refresh unless metadata in token changed, since token only stores id and role which remain unchanged)
    
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
