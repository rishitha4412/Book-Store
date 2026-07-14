import express from 'express';
import * as orderController from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require session authorization for all order actions
router.use(protect);

router.post('/', orderController.checkout);
router.get('/my-orders', orderController.getMyOrdersList);
router.get('/:id', orderController.getOrderDetails);
router.get('/:id/invoice', orderController.getInvoice);

export default router;
