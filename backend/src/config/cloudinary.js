import { v2 as cloudinary } from 'cloudinary';
import logger from '../utils/logger.js';

const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName || cloudName.includes('your_') ||
    !apiKey || apiKey.includes('your_') ||
    !apiSecret || apiSecret.includes('your_')
  ) {
    logger.warn('Cloudinary environment variables are missing or placeholders. Image uploads will fallback to mock assets.');
    return null;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  logger.info('Cloudinary initialized successfully.');
  return cloudinary;
};

const cloudinaryInstance = configureCloudinary();
export default cloudinaryInstance;
