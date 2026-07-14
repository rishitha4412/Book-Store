import cloudinaryInstance from '../config/cloudinary.js';
import logger from '../utils/logger.js';

// Asynchronously stream file buffers directly to Cloudinary with compression optimizations
export const uploadImageToCloudinary = (fileBuffer, folderName = 'bookstore') => {
  return new Promise((resolve, reject) => {
    // Graceful fallback to Unsplash if Cloudinary isn't configured
    if (!cloudinaryInstance) {
      logger.info('Cloudinary not configured. Returning mock image URL.');
      return resolve({
        secure_url: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
      });
    }

    const uploadStream = cloudinaryInstance.uploader.upload_stream(
      {
        folder: folderName,
        format: 'webp', // Convert automatically to optimized WebP format
        quality: 'auto', // Dynamic quality compression
        transformation: [
          { width: 800, height: 1100, crop: 'limit' }, // Lock maximum aspect size for book covers
        ],
      },
      (error, result) => {
        if (error) {
          logger.error('Cloudinary upload stream exception:', error);
          return reject(error);
        }
        resolve(result);
      }
    );

    // End stream by writing buffer
    uploadStream.end(fileBuffer);
  });
};
