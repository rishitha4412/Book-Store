import express from 'express';
import * as notificationController from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require authorization for all inbox operations
router.use(protect);

router.get('/', notificationController.getNotifications);
router.patch('/read-all', notificationController.readAllNotifications);
router.patch('/:id/read', notificationController.readNotification);

export default router;
