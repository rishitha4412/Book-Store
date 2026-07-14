import Review from '../models/Review.js';
import Book from '../models/Book.js';
import User from '../models/User.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Retrieve all reviews for a book
export const getReviewsForBook = async (bookId) => {
  return await Review.find({ book: bookId }).sort('-date');
};

// Create a review on a book
export const createReview = async (userId, reviewData) => {
  const { bookId, rating, comment } = reviewData;

  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError('Book not found', HTTP_STATUS.NOT_FOUND);
  }

  // Optional: Check if user already reviewed this book
  const existingReview = await Review.findOne({ book: bookId, user: userId });
  if (existingReview) {
    throw new AppError('You have already reviewed this book', HTTP_STATUS.BAD_REQUEST);
  }

  // Fetch user profile to snapshot reviewer profile details
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('User session invalid', HTTP_STATUS.UNAUTHORIZED);
  }

  const review = new Review({
    book: bookId,
    user: userId,
    userName: user.name,
    avatar: user.avatar,
    rating,
    comment,
  });

  await review.save();
  return review;
};
