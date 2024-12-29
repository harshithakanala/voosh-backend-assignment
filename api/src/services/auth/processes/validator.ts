import { body } from 'express-validator';

export const validateSignup = [
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
];