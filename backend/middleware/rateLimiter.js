const rateLimit = {};

const rateLimiter = (options = {}) => {
  const {
    windowMs = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
    maxRequests = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  } = options;

  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!rateLimit[ip]) {
      rateLimit[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    if (now > rateLimit[ip].resetTime) {
      rateLimit[ip] = { count: 1, resetTime: now + windowMs };
      return next();
    }

    rateLimit[ip].count += 1;

    if (rateLimit[ip].count > maxRequests) {
      const retryAfter = Math.ceil((rateLimit[ip].resetTime - now) / 1000);
      res.set('Retry-After', retryAfter.toString());
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter: `${retryAfter} seconds`,
      });
    }

    next();
  };
};

setInterval(() => {
  const now = Date.now();
  Object.keys(rateLimit).forEach((ip) => {
    if (now > rateLimit[ip].resetTime + 60000) {
      delete rateLimit[ip];
    }
  });
}, 300000);

module.exports = rateLimiter;
