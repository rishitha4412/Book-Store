import * as reviewService from '../services/reviewService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getBookReviews = async (req, res, next) => {
  try {
    const { bookId } = req.params;
    const reviews = await reviewService.getReviewsForBook(bookId);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req, res, next) => {
  try {
    const reviewData = {
      bookId: req.body.bookId,
      rating: req.body.rating,
      comment: req.body.comment,
    };

    const review = await reviewService.createReview(req.user._id, reviewData);

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Review posted successfully',
      data: review,
    });
  } catch (error) {
    next(error);
  }
};
