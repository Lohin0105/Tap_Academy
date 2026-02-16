import { body } from 'express-validator';

export const registerValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('employeeCode').trim().notEmpty().withMessage('Employee code is required'),
    body('department').trim().notEmpty().withMessage('Department is required'),
    body('role').optional().isIn(['employee', 'manager']).withMessage('Invalid role'),
];

export const loginValidation = [
    body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

export const checkInValidation = [
    body('date').optional().isISO8601().withMessage('Invalid date format'),
];

export const checkOutValidation = [
    body('date').optional().isISO8601().withMessage('Invalid date format'),
];
