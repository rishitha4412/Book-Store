import { uploadImageToCloudinary } from '../services/uploadService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';
import AppError from '../utils/appError.js';

export const uploadImage = async (req, res, next) => {
  try {
    // req.file is populated by Multer single upload middleware
    if (!req.file) {
      throw new AppError('Please select an image file to upload.', HTTP_STATUS.BAD_REQUEST);
    }

    const folder = req.body.folder || 'bookstore';
    const result = await uploadImageToCloudinary(req.file.buffer, folder);

    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        url: result.secure_url,
      },
    });
  } catch (error) {
    next(error);
  }
};
