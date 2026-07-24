import rateLimit from 'express-rate-limit';

/**
 * Global API Rate Limiter
 * Limits requests per IP to 100 per 15-minute window
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true, // Draft-6 rate limit headers
  legacyHeaders: false, // Hide X-RateLimit-* headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});
export default globalLimiter;
