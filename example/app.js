import express from 'express';
import { createRateLimiter } from '../src/middlewares/rateLimiter.js';
import { LeakyBucketLimiter } from '../src/strategies/leakyBucket.js';
import { TokenBucketLimiter } from '../src/strategies/tokenBucket.js';

const app = express();
const PORT = process.env.PORT || 3000;

const leakyLimiter = new LeakyBucketLimiter({ leakRate: 1, capacity: 5 });
const tokenLimiter = new TokenBucketLimiter({ refillRate: 2, capacity: 5 });

app.use('/leaky', createRateLimiter(leakyLimiter));
app.use('/token', createRateLimiter(tokenLimiter));

app.get('/leaky', (req, res) => {
  res.json({ message: 'Allowed req from leaky bucket limiter.' });
});

app.get('/token', (req, res) => {
  res.json({ message: 'Allowed req from token bucket limiter' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
