import multer from 'multer';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Store files in memory as buffer streams instead of writing to local disk
const storage = multer.memoryStorage();

// File filter to intercept non-image mime types
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(
      new AppError('Invalid file type! Please upload only image files.', HTTP_STATUS.BAD_REQUEST),
      false
    );
  }
};

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB maximum file size limit
  },
  fileFilter,
});

export const uploadSingleImage = upload.single('image');
