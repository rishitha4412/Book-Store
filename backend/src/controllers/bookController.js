import * as bookService from '../services/bookService.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getAllBooks = async (req, res, next) => {
  try {
    const result = await bookService.queryBooks(req.query);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const getBookDetails = async (req, res, next) => {
  try {
    const book = await bookService.getBookById(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeatured = async (req, res, next) => {
  try {
    const books = await bookService.getFeaturedBooks();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const getBestSellersList = async (req, res, next) => {
  try {
    const books = await bookService.getBestSellers();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const getTrending = async (req, res, next) => {
  try {
    const books = await bookService.getTrendingBooks();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const getNewArrivalsList = async (req, res, next) => {
  try {
    const books = await bookService.getNewArrivals();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: books,
    });
  } catch (error) {
    next(error);
  }
};

export const getFiltersMetadata = async (req, res, next) => {
  try {
    const metadata = await bookService.getFilterMetadata();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: metadata,
    });
  } catch (error) {
    next(error);
  }
};

export const getTestimonialsList = async (req, res, next) => {
  try {
    const testimonials = await bookService.getTestimonials();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

export const getStatsList = async (req, res, next) => {
  try {
    const stats = await bookService.getStats();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: stats,
    });
  } catch (error) {
    next(error);
  }
};

export const getFaqsList = async (req, res, next) => {
  try {
    const faqs = await bookService.getFaqs();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: faqs,
    });
  } catch (error) {
    next(error);
  }
};

// Admin handlers
export const addBook = async (req, res, next) => {
  try {
    const book = await bookService.createBook(req.body);
    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Book created successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const editBook = async (req, res, next) => {
  try {
    const book = await bookService.updateBook(req.params.id, req.body);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Book updated successfully',
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

export const removeBook = async (req, res, next) => {
  try {
    await bookService.deleteBook(req.params.id);
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Book deleted successfully',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
