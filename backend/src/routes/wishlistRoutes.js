import express from 'express';
import * as wishlistController from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require session authorization for all wishlist operations
router.use(protect);

router.get('/', wishlistController.getUserWishlist);
router.post('/', wishlistController.addBookToWishlist);
router.delete('/:id', wishlistController.removeBookFromWishlist);

export default router;
