import express from 'express';
import * as uploadController from '../controllers/uploadController.js';
import { uploadSingleImage } from '../middleware/uploadMiddleware.js';
import { protect, restrictTo } from '../middleware/authMiddleware.js';

const router = express.Router();

// Allow only administrators to upload media files
router.post(
  '/',
  protect,
  restrictTo('admin'),
  uploadSingleImage,
  uploadController.uploadImage
);

export default router;
