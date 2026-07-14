import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

import requestLogger from './middleware/requestLogger.js';
import errorMiddleware from './middleware/errorMiddleware.js';
import AppError from './utils/appError.js';
import HTTP_STATUS from './constants/httpStatusCodes.js';

import authRoutes from './routes/authRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import addressRoutes from './routes/addressRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

const app = express();

// 1. Global Middleware - Security Headers
app.use(helmet());

// 2. Global Middleware - CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent across origins
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// 3. Global Middleware - Request Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    errors: [],
  },
});
app.use('/api', limiter);

// 4. Global Middleware - Body parsers with size limit validation
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Global Middleware - Cookie parser
app.use(cookieParser(process.env.COOKIE_SECRET));

// 6. Global Middleware - Compression
app.use(compression());

// 7. Global Middleware - Request Logging
app.use(requestLogger);

// 8. Base Health Check Route
app.get('/api/v1/health', (req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Operation successful',
    data: {
      status: 'UP',
      environment: process.env.NODE_ENV || 'development',
      uptime: `${Math.floor(process.uptime())}s`,
    },
  });
});

// 9. Mounted API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books', bookRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/wishlist', wishlistRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/addresses', addressRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/upload', uploadRoutes);

// 10. Centralized Route fallback (404 Not Found)
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, HTTP_STATUS.NOT_FOUND));
});

// 11. Centralized Error Middleware (Must be registered last)
app.use(errorMiddleware);

export default app;
