import Coupon from '../models/Coupon.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Validates if coupon is active, unexpired, and below usage limits
export const validateCoupon = async (code) => {
  const formattedCode = code.trim().toUpperCase();
  const coupon = await Coupon.findOne({ code: formattedCode });

  if (!coupon) {
    throw new AppError('Invalid coupon code.', HTTP_STATUS.NOT_FOUND);
  }

  if (!coupon.isValid()) {
    throw new AppError('This coupon code has expired or is no longer active.', HTTP_STATUS.BAD_REQUEST);
  }

  return coupon;
};

// Admin operation: create a promo coupon
export const createPromoCoupon = async (couponData) => {
  const existingCoupon = await Coupon.findOne({ code: couponData.code.toUpperCase() });
  if (existingCoupon) {
    throw new AppError('Coupon code already exists.', HTTP_STATUS.BAD_REQUEST);
  }

  const newCoupon = new Coupon(couponData);
  await newCoupon.save();
  return newCoupon;
};
