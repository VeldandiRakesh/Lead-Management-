import { body } from 'express-validator';

/**
 * Validation rules for creating a new lead opportunity
 */
export const createLeadValidator = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full Name is required'),
  
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).withMessage('Invalid phone number format'),
  
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']).withMessage('Invalid status value'),
  
  body('assigned_to')
    .notEmpty().withMessage('Assigned User is required')
    .isInt({ min: 1 }).withMessage('Assigned User ID must be a valid integer ID')
];

/**
 * Validation rules for updating an existing lead
 */
export const updateLeadValidator = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full Name is required'),
  
  body('company')
    .trim()
    .notEmpty().withMessage('Company is required'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/).withMessage('Invalid phone number format'),
  
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost']).withMessage('Invalid status value'),
  
  body('assigned_to')
    .notEmpty().withMessage('Assigned User is required')
    .isInt({ min: 1 }).withMessage('Assigned User ID must be a valid integer ID')
];

/**
 * Validation rules for adding notes to a lead
 */
export const addNoteValidator = [
  body('note')
    .trim()
    .notEmpty().withMessage('Note text cannot be empty')
];
