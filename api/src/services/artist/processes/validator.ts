import { body, param, query } from 'express-validator';

export const validateGetArtists = [
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer.'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer.'),
  query('grammy')
    .optional()
    .isInt()
    .withMessage('Grammy must be a valid number.'),
  query('hidden')
    .optional()
    .isIn(['true', 'false'])
    .withMessage('Hidden must be either "true" or "false".'),
];

export const validateGetArtistById = [
  param('id')
    .isUUID()
    .withMessage('Invalid Artist ID.'),
];

export const validateAddArtist = [
  body('name')
    .notEmpty()
    .withMessage('Name is required.')
    .isString()
    .withMessage('Name must be a string.'),
  body('grammy')
    .optional()
    .isInt()
    .withMessage('Grammy must be a valid number.'),
  body('hidden')
    .isBoolean()
    .withMessage('Hidden must be a boolean value.'),
];

export const validateUpdateArtist = [
  param('id')
    .isUUID()
    .withMessage('Invalid Artist ID.'),
  body('name')
    .optional()
    .isString()
    .withMessage('Name must be a string.'),
  body('grammy')
    .optional()
    .isInt()
    .withMessage('Grammy must be a valid number.'),
  body('hidden')
    .optional()
    .isBoolean()
    .withMessage('Hidden must be a boolean value.'),
];

export const validateDeleteArtist = [
  param('id')
    .isUUID()
    .withMessage('Invalid Artist ID.'),
];
