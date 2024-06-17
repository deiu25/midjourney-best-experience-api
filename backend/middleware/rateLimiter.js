// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'You have made 100 requests, this is the limit per minute'
  },
  headers: true,
});

module.exports = limiter;
