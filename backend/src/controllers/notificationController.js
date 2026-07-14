import * as notificationService from '../services/notificationService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getNotifications = async (req, res, next) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: notifications,
    });
  } catch (error) {
    next(error);
  }
};

export const readNotification = async (req, res, next) => {
  try {
    const { id } = req.params;
    const notification = await notificationService.markAsRead(req.user._id, id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Notification marked as read successfully',
      data: notification,
    });
  } catch (error) {
    next(error);
  }
};

export const readAllNotifications = async (req, res, next) => {
  try {
    await notificationService.markAllAsRead(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'All notifications marked as read successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
