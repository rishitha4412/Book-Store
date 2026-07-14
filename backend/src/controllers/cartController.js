import * as cartService from '../services/cartService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getUserCart = async (req, res, next) => {
  try {
    const cart = await cartService.getCart(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const addItemToCart = async (req, res, next) => {
  try {
    const { bookId, quantity } = req.body;
    const cart = await cartService.addToCart(req.user._id, bookId, quantity);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item added to cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateQuantity = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateCartItemQuantity(req.user._id, bookId, quantity);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart updated successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const removeItem = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const cart = await cartService.removeFromCart(req.user._id, bookId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Item removed from cart successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

export const emptyCart = async (req, res, next) => {
  try {
    const cart = await cartService.clearCart(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};
