import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { errorResponse } from '../utils/response.js';

/**
 * JWT Authentication Middleware
 * Decodes the token from cookies or Authorization Bearer header
 */
export const authenticateJWT = (req, res, next) => {
  let token = null;

  // 1. Check Authorization Header (Bearer token)
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  // 2. Fallback to parsing HTTP cookies
  if (!token && req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return errorResponse(res, 'Access denied. Authentication token missing.', 401);
  }

  try {
    // Verify token signature
    const decoded = jwt.verify(token, env.jwtSecret);
    
    // Attach decoded session details to request context
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role?.toLowerCase()
    };
    
    next();
  } catch (error) {
    return errorResponse(res, 'Invalid or expired authentication token.', 401);
  }
};

/**
 * Role-Based Access Control Middleware
 * @param {Array<string>} allowedRoles - List of allowed roles
 */
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'Access denied. Session credentials missing.', 401);
    }

    const userRole = req.user.role?.toLowerCase();
    const isAllowed = allowedRoles.map(r => r.toLowerCase()).includes(userRole);

    if (!isAllowed) {
      return errorResponse(res, 'Forbidden. You do not have permissions to access this route.', 403);
    }

    next();
  };
};

// Ready-made role restrictor middlewares
export const requireAdmin = requireRole(['admin']);
export const requireMemberOrAdmin = requireRole(['admin', 'member']);
