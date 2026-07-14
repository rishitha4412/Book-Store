import express from 'express';
import * as couponController from '../controllers/couponController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// User verification endpoint
router.get('/validate/:code', protect, couponController.checkCoupon);

// Admin-only coupon creations
router.post('/', protect, restrictTo('admin'), couponController.addCoupon);

export default router;
