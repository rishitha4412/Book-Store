import express from 'express';
import * as cartController from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require session authorization for all cart operations
router.use(protect);

router.route('/')
  .get(cartController.getUserCart)
  .post(cartController.addItemToCart)
  .delete(cartController.emptyCart);

router.route('/:bookId')
  .put(cartController.updateQuantity)
  .delete(cartController.removeItem);

export default router;
