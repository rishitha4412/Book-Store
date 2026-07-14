import Wishlist from '../models/Wishlist.js';
import Book from '../models/Book.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Retrieve wishlist for a user (creates one if it does not exist)
export const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate('books');
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, books: [] });
  }
  return wishlist;
};

// Add a book to a user's wishlist
export const addToWishlist = async (userId, bookId) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError('Book not found', HTTP_STATUS.NOT_FOUND);
  }

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, books: [] });
  }

  // Prevent duplicate additions
  if (!wishlist.books.includes(bookId)) {
    wishlist.books.push(bookId);
    await wishlist.save();
  }

  return await wishlist.populate('books');
};

// Remove a book from the user's wishlist
export const removeFromWishlist = async (userId, bookId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) {
    throw new AppError('Wishlist not found', HTTP_STATUS.NOT_FOUND);
  }

  wishlist.books = wishlist.books.filter((id) => id.toString() !== bookId);
  await wishlist.save();

  return await wishlist.populate('books');
};
