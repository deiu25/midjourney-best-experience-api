// middleware/logger.js
const requestCount = {};
const timeFrame = 60 * 1000; // 1 minute
const rateLimit = 100; // Limit of requests per minute

// Middleware function to log request and count them
function logRequests(req, res, next) {
  const currentTime = Date.now();
  const currentMinute = Math.floor(currentTime / timeFrame);

  // Increment the count for the current minute
  if (!requestCount[currentMinute]) {
    requestCount[currentMinute] = 0;
  }
  requestCount[currentMinute]++;

  // Check if the request count exceeds the limit
  if (requestCount[currentMinute] > rateLimit) {
    console.log('Rate limit exceeded');
    return res.status(429).json({
      error: 'You have made 100 requests, this is the limit per minute',
      limitExceeded: true
    });
  }

  next();
}

module.exports = logRequests;
