import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { loginValidator } from '../validators/auth.validator.js';
import { authenticateJWT } from '../middleware/auth.middleware.js';

const router = Router();

/**
 * @route   POST /api/auth/login
 * @desc    Sign in user, return JWT and profile details
 * @access  Public
 */
router.post('/login', loginValidator, AuthController.login);

/**
 * @route   POST /api/auth/logout
 * @desc    Clear cookies and terminate session
 * @access  Public
 */
router.post('/logout', AuthController.logout);

/**
 * @route   GET /api/auth/me
 * @desc    Retrieve active logged-in user details
 * @access  Private (requires JWT validation)
 */
router.get('/me', authenticateJWT, AuthController.me);

export default router;
