import { body, param } from 'express-validator';
import { handleValidationErrors } from './authValidator.js';

export const validateBookInput = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Book title is required'),
  body('author')
    .trim()
    .notEmpty()
    .withMessage('Author name is required'),
  body('price')
    .notEmpty()
    .withMessage('Price is required')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be a number between 0 and 100'),
  body('coverImage')
    .trim()
    .notEmpty()
    .withMessage('Cover image URL is required'),
  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category name is required'),
  body('publishedDate')
    .notEmpty()
    .withMessage('Published date is required')
    .isISO8601()
    .withMessage('Published date must be a valid ISO 8601 date (YYYY-MM-DD)'),
  body('pages')
    .notEmpty()
    .withMessage('Pages count is required')
    .isInt({ min: 1 })
    .withMessage('Pages must be a positive integer'),
  body('isbn')
    .trim()
    .notEmpty()
    .withMessage('ISBN code is required'),
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Stock count cannot be negative'),
  handleValidationErrors,
];

export const validateBookId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid Book ID format'),
  handleValidationErrors,
];
