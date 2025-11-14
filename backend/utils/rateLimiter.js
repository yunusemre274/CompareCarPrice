import rateLimit from 'express-rate-limit';

/**
 * Rate limiter middleware
 * Default: 100 requests per minute per IP
 */
export const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 60000, // 1 minute
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: true,
    message: 'Too many requests from this IP, please try again later',
    status: 429
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: true,
      message: 'Too many requests from this IP, please try again later',
      status: 429,
      retryAfter: req.rateLimit.resetTime
    });
  }
});

/**
 * Strict rate limiter for sensitive endpoints
 * 20 requests per minute
 */
export const strictLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 20,
  message: {
    error: true,
    message: 'Rate limit exceeded for this endpoint',
    status: 429
  },
  standardHeaders: true,
  legacyHeaders: false
});

export default {
  limiter,
  strictLimiter
};
