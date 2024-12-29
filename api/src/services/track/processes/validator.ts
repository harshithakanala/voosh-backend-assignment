import { body, param, query } from 'express-validator';

export const validateAddTrack = [
  body('name').isString().notEmpty(),
  body('duration').isInt({ min: 1 }),
  body('hidden').isBoolean(),
  body('artistId').isString().notEmpty(),
  body('albumId').isString().notEmpty(),
];

export const validateUpdateTrack = [
  param('id').isString().notEmpty(),
  body('name').optional().isString().notEmpty(),
  body('duration').optional().isInt({ min: 1 }),
  body('hidden').optional().isBoolean(),
];

export const validateGetTracks = [
  query('limit').optional().isInt(),
  query('offset').optional().isInt(),
  query('artist_id').optional().isString(),
  query('album_id').optional().isString(),
  query('hidden').optional().isBoolean(),
];

export const validateGetTrackById = [
  param('id').isUUID().withMessage('Invalid Track ID'),
];

export const validateDeleteTrack = [
  param('id').isUUID().withMessage('Invalid Track ID'),
];
