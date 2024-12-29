import { body, param, query } from 'express-validator';

export const validateAddAlbum = [
  body('name').isString().notEmpty(),
  body('year').isInt({ min: 1900 }),
  body('hidden').isBoolean(),
  body('artistId').isString().notEmpty(),
];

export const validateUpdateAlbum = [
  param('id').isString().notEmpty(),
  body('name').optional().isString().notEmpty(),
  body('year').optional().isInt({ min: 1900 }),
  body('hidden').optional().isBoolean(),
];

export const validateGetAlbums = [
  query('limit').optional().isInt(),
  query('offset').optional().isInt(),
  query('artist_id').optional().isString(),
  query('hidden').optional().isBoolean(),
];

export const validateGetAlbumById = [
  param('id').isUUID().withMessage('Invalid Album ID'),
];

export const validateDeleteAlbum = [
  param('id').isUUID().withMessage('Invalid Album ID'),
];
