import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Lock all administrative routes behind verification and admin role requirements
router.use(protect);
router.use(restrictTo('admin'));

router.get('/dashboard-stats', adminController.getDashboardStats);
router.get('/inventory', adminController.getInventory);
router.get('/reports', adminController.getReports);

router.route('/orders')
  .get(adminController.getAllOrders);

router.route('/orders/:id/status')
  .patch(adminController.updateStatus);

export default router;
