import * as couponService from '../services/couponService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const checkCoupon = async (req, res, next) => {
  try {
    const { code } = req.params;
    const coupon = await couponService.validateCoupon(code);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Coupon is valid and applied successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};

export const addCoupon = async (req, res, next) => {
  try {
    const coupon = await couponService.createPromoCoupon(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Coupon created successfully',
      data: coupon,
    });
  } catch (error) {
    next(error);
  }
};
