import express from 'express';
import * as addressController from '../controllers/addressController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Require session authorization for all address operations
router.use(protect);

router.route('/')
  .get(addressController.getAllAddresses)
  .post(addressController.addAddress);

router.route('/:id')
  .put(addressController.editAddress)
  .delete(addressController.removeAddress);

export default router;
