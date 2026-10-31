const rateLimit = require('express-rate-limit');

// Rate limiter for chat endpoints to prevent abuse
const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 30, // Limit each IP to 30 requests per minute
  message: {
    success: false,
    message: 'Too many requests generated from this IP, please try again in a moment.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter for authentication routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 50, // Limit each IP to 50 auth requests per 15 minutes
  message: {
    success: false,
    message: 'Too many login/registration attempts, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { chatLimiter, authLimiter };
