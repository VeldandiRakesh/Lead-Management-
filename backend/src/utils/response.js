/**
 * Standard Success Response Wrapper
 * @param {Object} res - Express Response object
 * @param {string} message - Response description message
 * @param {Object|Array|null} data - Optional payload data
 * @param {number} statusCode - HTTP status code (default: 200)
 */
export const successResponse = (res, message, data = null, statusCode = 200) => {
  const payload = {
    success: true,
    message,
  };

  if (data !== null) {
    payload.data = data;
  }

  return res.status(statusCode).json(payload);
};

/**
 * Standard Error Response Wrapper
 * @param {Object} res - Express Response object
 * @param {string} message - Error description message
 * @param {number} statusCode - HTTP status code (default: 500)
 * @param {Object|Array|null} errors - Optional detailed validation errors or structures
 */
export const errorResponse = (res, message, statusCode = 500, errors = null) => {
  const payload = {
    success: false,
    message,
  };

  if (errors !== null) {
    payload.errors = errors;
  }

  return res.status(statusCode).json(payload);
};
