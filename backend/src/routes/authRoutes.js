import express from 'express';
import * as authController from '../controllers/authController.js';
import * as authValidator from '../validators/authValidator.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/register', authValidator.validateRegister, authController.register);
router.post('/login', authValidator.validateLogin, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh-token', authController.refreshToken);

router.post('/forgot-password', authValidator.validateForgotPassword, authController.forgotPassword);
router.patch('/reset-password/:token', authValidator.validateResetPassword, authController.resetPassword);

// Protected Routes
router.get('/me', protect, authController.getMe);
router.put('/profile', protect, authController.updateProfile);

export default router;
