import * as bookService from '../services/bookService.js';
import Category from '../models/Category.js';
import AppError from '../utils/appError.js';
import HTTP_STATUS from '../constants/httpStatusCodes.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await bookService.queryCategories();
    res.status(HTTP_STATUS.OK).json({
      success: true,
      message: 'Operation successful',
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const addCategory = async (req, res, next) => {
  try {
    const { name, cover, slug } = req.body;

    const existingCategory = await Category.findOne({ name: { $regex: `^${name}$`, $options: 'i' } });
    if (existingCategory) {
      throw new AppError('Category already exists', HTTP_STATUS.BAD_REQUEST);
    }

    const calculatedSlug = slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newCategory = new Category({
      name,
      cover,
      slug: calculatedSlug,
    });

    await newCategory.save();

    res.status(HTTP_STATUS.CREATED).json({
      success: true,
      message: 'Category created successfully',
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};
