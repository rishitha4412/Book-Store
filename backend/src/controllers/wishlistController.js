import * as wishlistService from '../services/wishlistService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getUserWishlist = async (req, res, next) => {
  try {
    const wishlist = await wishlistService.getWishlist(req.user._id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const addBookToWishlist = async (req, res, next) => {
  try {
    const { bookId } = req.body;
    const wishlist = await wishlistService.addToWishlist(req.user._id, bookId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Book added to wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};

export const removeBookFromWishlist = async (req, res, next) => {
  try {
    const { id } = req.params; // bookId
    const wishlist = await wishlistService.removeFromWishlist(req.user._id, id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Book removed from wishlist successfully',
      data: wishlist,
    });
  } catch (error) {
    next(error);
  }
};
