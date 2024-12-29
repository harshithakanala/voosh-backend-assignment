import { body, param, query } from 'express-validator';
import { Constants } from 'music-types';

export const validateGetFavorites = [
  param('category').isIn([Constants.CategoryType.Artist, Constants.CategoryType.Album, Constants.CategoryType.Track]).withMessage('Invalid category.'),
  query('limit').optional().isInt({ min: 1 }).toInt().withMessage('Limit must be a positive integer.'),
  query('offset').optional().isInt({ min: 0 }).toInt().withMessage('Offset must be a non-negative integer.'),
];

export const validateAddFavorite = [
  body('category').isIn([Constants.CategoryType.Artist, Constants.CategoryType.Album, Constants.CategoryType.Track]).withMessage('Invalid category.'),
  body('item_id').notEmpty().withMessage('Item ID is required.'),
];

export const validateRemoveFavorite = [
  param('id').isUUID().withMessage('Invalid favorite ID.'),
];
