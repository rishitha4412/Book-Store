import * as orderService from '../services/orderService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const checkout = async (req, res, next) => {
  try {
    const order = await orderService.createCheckoutOrder(req.user._id, req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyOrdersList = async (req, res, next) => {
  try {
    const orders = await orderService.getMyOrders(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

export const getOrderDetails = async (req, res, next) => {
  try {
    const order = await orderService.getOrderDetails(req.user._id, req.user.role, req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

export const getInvoice = async (req, res, next) => {
  try {
    const invoice = await orderService.getOrderInvoice(req.user._id, req.user.role, req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: invoice,
    });
  } catch (error) {
    next(error);
  }
};
