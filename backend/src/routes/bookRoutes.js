import express from 'express';
import * as bookController from '../controllers/bookController.js';
import * as bookValidator from '../validators/bookValidator.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public Banner Queries (Landing Page / Sidebar Lists)
router.get('/featured', bookController.getFeatured);
router.get('/best-sellers', bookController.getBestSellersList);
router.get('/trending', bookController.getTrending);
router.get('/new-arrivals', bookController.getNewArrivalsList);
router.get('/filters-metadata', bookController.getFiltersMetadata);
router.get('/stats', bookController.getStatsList);
router.get('/testimonials', bookController.getTestimonialsList);
router.get('/faqs', bookController.getFaqsList);

// Catalog query
router.get('/', bookController.getAllBooks);
router.get('/:id', bookValidator.validateBookId, bookController.getBookDetails);

// Admin-Only Catalog Management
router.post(
  '/',
  protect,
  restrictTo('admin'),
  bookValidator.validateBookInput,
  bookController.addBook
);

router.put(
  '/:id',
  protect,
  restrictTo('admin'),
  bookValidator.validateBookId,
  bookValidator.validateBookInput,
  bookController.editBook
);

router.delete(
  '/:id',
  protect,
  restrictTo('admin'),
  bookValidator.validateBookId,
  bookController.removeBook
);

export default router;
