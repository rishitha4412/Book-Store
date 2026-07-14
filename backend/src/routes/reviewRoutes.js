import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public route to view book reviews
router.get('/book/:bookId', reviewController.getBookReviews);

// Protected route to submit a review
router.post('/', protect, reviewController.addReview);

export default router;
