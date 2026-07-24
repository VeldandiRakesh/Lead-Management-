import { errorResponse } from '../utils/response.js';
import { env } from '../config/env.js';

/**
 * 404 Not Found Router Route Handler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Resource not found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

/**
 * Global HTTP Error Handler
 */
export const globalErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  const errorMessage = err.message || 'An internal server error occurred';

  // Log to console in non-production environments
  if (!env.isProduction) {
    console.error(`[Error Log] => ${err.stack}`);
  }

  return errorResponse(
    res,
    errorMessage,
    statusCode,
    env.isProduction ? null : { stack: err.stack }
  );
};
export default globalErrorHandler;
