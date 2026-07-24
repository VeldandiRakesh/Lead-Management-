import { validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import UserRepository from '../repositories/user.repository.js';
import { successResponse, errorResponse } from '../utils/response.js';

/**
 * Controller handlers for authentication routes
 */
export const AuthController = {
  /**
   * Handle user login request
   */
  login: async (req, res) => {
    // 1. Validate request parameters
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return errorResponse(res, 'Validation rules violated.', 400, errors.array());
    }

    const { email, password } = req.body;

    try {
      // 2. Look up user by email
      const user = UserRepository.findByEmail(email);
      if (!user) {
        return errorResponse(res, 'Invalid email or password.', 401);
      }

      // Verify that user account is active
      if (Number(user.is_active) === 0) {
        return errorResponse(res, 'Your user profile is inactive. Please contact support.', 403);
      }

      // 3. Match password with bcrypt hash
      const isMatch = bcrypt.compareSync(password, user.password);
      if (!isMatch) {
        return errorResponse(res, 'Invalid email or password.', 401);
      }

      // 4. Generate JWT payload token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        env.jwtSecret,
        { expiresIn: '8h' }
      );

      // 5. Send secure HTTP-only Cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: env.isProduction,
        maxAge: 8 * 60 * 60 * 1000, // 8 hours
        sameSite: 'strict',
      });

      // Clear password field from metadata response
      const userMetadata = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };

      return successResponse(res, 'Login successful.', { token, user: userMetadata });
    } catch (error) {
      console.error('[Login Controller Error]', error);
      return errorResponse(res, 'An error occurred during authentication processing.', 500);
    }
  },

  /**
   * Clear session token cookies on logout
   */
  logout: (req, res) => {
    res.clearCookie('token');
    return successResponse(res, 'Logout successful.');
  },

  /**
   * Return active logged-in user profile metadata
   */
  me: (req, res) => {
    try {
      const user = UserRepository.findById(req.user.id);
      if (!user) {
        return errorResponse(res, 'User record not found.', 404);
      }

      if (Number(user.is_active) === 0) {
        return errorResponse(res, 'Your account is deactivated.', 403);
      }

      const userMetadata = {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      };

      return successResponse(res, 'Active session context retrieved.', userMetadata);
    } catch (error) {
      console.error('[Me Controller Error]', error);
      return errorResponse(res, 'An error occurred fetching session identity.', 500);
    }
  }
};

export default AuthController;
