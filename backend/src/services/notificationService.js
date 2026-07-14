import Notification from '../models/Notification.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Retrieve notifications list for a specific user
export const getUserNotifications = async (userId) => {
  return await Notification.find({ user: userId }).sort('-createdAt').lean();
};

// Mark single notification as read
export const markAsRead = async (userId, notificationId) => {
  const notification = await Notification.findOne({ _id: notificationId, user: userId });
  if (!notification) {
    throw new AppError('Notification not found', HTTP_STATUS.NOT_FOUND);
  }

  notification.isRead = true;
  await notification.save();
  return notification;
};

// Mark all user notifications as read
export const markAllAsRead = async (userId) => {
  await Notification.updateMany(
    { user: userId, isRead: false },
    { $set: { isRead: true } }
  );
  return true;
};
