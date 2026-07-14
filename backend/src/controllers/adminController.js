import * as adminService from '../services/adminService.js';
import Order from '../models/Order.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await adminService.getDashboardStats();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getInventory = async (req, res, next) => {
  try {
    const inventory = await adminService.getInventoryStatus();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: inventory,
    });
  } catch (error) {
    next(error);
  }
};

export const getReports = async (req, res, next) => {
  try {
    const reports = await adminService.getSalesReport();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: reports,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    const queryObj = {};
    if (status) {
      queryObj.orderStatus = status;
    }

    const p = parseInt(page, 10);
    const l = parseInt(limit, 10);
    const skip = (p - 1) * l;

    const orders = await Order.find(queryObj)
      .populate('user', 'name email')
      .sort('-createdAt')
      .skip(skip)
      .limit(l)
      .lean();

    const totalCount = await Order.countDocuments(queryObj);
    const totalPages = Math.ceil(totalCount / l);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: {
        orders,
        totalPages,
        totalCount,
        currentPage: p,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedOrder = await adminService.updateOrderStatus(id, status);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};
