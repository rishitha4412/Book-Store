import Cart from '../models/Cart.js';
import Book from '../models/Book.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

// Retrieve cart for a user (creates one if it does not exist)
export const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.book');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// Add an item to the shopping cart
export const addToCart = async (userId, bookId, quantity = 1) => {
  const book = await Book.findById(bookId);
  if (!book) {
    throw new AppError('Book not found', HTTP_STATUS.NOT_FOUND);
  }

  // Calculate price after discount
  const itemPrice = book.discount > 0 
    ? parseFloat((book.price * (1 - book.discount / 100)).toFixed(2)) 
    : book.price;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  // Check if book already exists in the cart
  const itemIndex = cart.items.findIndex((item) => item.book.toString() === bookId);

  if (itemIndex > -1) {
    // Increment quantity
    cart.items[itemIndex].quantity += quantity;
    // Update price if catalog price changed
    cart.items[itemIndex].price = itemPrice;
  } else {
    // Add new item
    cart.items.push({
      book: bookId,
      quantity,
      price: itemPrice,
    });
  }

  await cart.save();
  return await cart.populate('items.book');
};

// Modify quantity for an item in the cart
export const updateCartItemQuantity = async (userId, bookId, quantity) => {
  if (quantity < 1) {
    throw new AppError('Quantity must be at least 1', HTTP_STATUS.BAD_REQUEST);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND);
  }

  const itemIndex = cart.items.findIndex((item) => item.book.toString() === bookId);
  if (itemIndex === -1) {
    throw new AppError('Item not found in cart', HTTP_STATUS.NOT_FOUND);
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  return await cart.populate('items.book');
};

// Remove a book from the cart
export const removeFromCart = async (userId, bookId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND);
  }

  cart.items = cart.items.filter((item) => item.book.toString() !== bookId);
  await cart.save();

  return await cart.populate('items.book');
};

// Empty the shopping cart
export const clearCart = async (userId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND);
  }

  cart.items = [];
  await cart.save();

  return cart;
};
