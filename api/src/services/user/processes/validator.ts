import { body, param, query } from 'express-validator';

export const validateGetUsers = [
  query('limit')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Limit must be a positive integer.'),
  query('offset')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Offset must be a non-negative integer.'),
  query('role')
    .optional()
    .isIn(['editor', 'viewer', 'admin'])
    .withMessage('Role must be one of "editor", "viewer", or "admin".'),
];

export const validateAddUser = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format.')
    .notEmpty()
    .withMessage('Email is required.'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long.')
    .notEmpty()
    .withMessage('Password is required.'),
  body('role')
    .isIn(['editor', 'viewer'])
    .withMessage('Role must be either "editor" or "viewer".')
    .notEmpty()
    .withMessage('Role is required.'),
];

export const validateDeleteUser = [
  param('id')
    .isUUID()
    .withMessage('Invalid User ID.')
    .notEmpty()
    .withMessage('User ID is required.'),
];

export const validateUpdatePassword = [
  body('old_password')
    .isLength({ min: 8 })
    .withMessage('Old password must be at least 8 characters long.')
    .notEmpty()
    .withMessage('Old password is required.'),
  body('new_password')
    .isLength({ min: 8 })
    .withMessage('New password must be at least 8 characters long.')
    .notEmpty()
    .withMessage('New password is required.'),
];