import { body } from 'express-validator';

/**
 * Validator rules array for the Login endpoint
 */
export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email address is required')
    .isEmail().withMessage('Must be a valid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];
