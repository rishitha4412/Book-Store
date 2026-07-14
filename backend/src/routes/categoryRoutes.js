import express from 'express';
import * as categoryController from '../controllers/categoryController.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public listing
router.get('/', categoryController.getAllCategories);

// Admin creation
router.post('/', protect, restrictTo('admin'), categoryController.addCategory);

export default router;
