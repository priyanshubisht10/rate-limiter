export const createRateLimiter = (strategy) => {
  return async (req, res, next) => {
    const ip = req.ip || req.connection?.remoteAddress || 'unknown';

    try {
      const allowed = await strategy.allowRequest(ip);

      if (!allowed) {
        return res.status(429).json({ message: 'Too many requests' });
      }

      next();
    } catch (err) {
      console.log('Rate limiter error:', err);
      res.status(500).json({ message: 'Internal rate limiter error' });
    }
  };
};
