import express from 'express';
import {
  createRateLimiter,
  FixedWindowLimiter,
  SlidingWindowLimiter,
  LeakyBucketLimiter,
  TokenBucketLimiter
} from '../src/index.js';

const app = express();
const PORT = process.env.PORT || 3000;

const leakyLimiter = new LeakyBucketLimiter({ leakRate: 1, capacity: 5 });
const tokenLimiter = new TokenBucketLimiter({ refillRate: 2, capacity: 5 });
const fixedLimiter = new FixedWindowLimiter({ maxReq: 5, windowSizeInSeconds: 10 });
const slidingLimiter = new SlidingWindowLimiter({ maxReq: 5, windowSizeInSeconds: 10 });

app.use('/leaky', createRateLimiter(leakyLimiter));
app.use('/token', createRateLimiter(tokenLimiter));
app.use('/fixed', createRateLimiter(fixedLimiter));
app.use('/sliding', createRateLimiter(slidingLimiter));

app.get('/leaky', (req, res) => {
  res.json({ message: 'Allowed req from leaky bucket limiter.' });
});

app.get('/token', (req, res) => {
  res.json({ message: 'Allowed req from token bucket limiter' });
});

app.get('/fixed', (req, res) => {
  res.json({ message: 'Allowed req from fixed window limiter' });
});

app.get('/sliding', (req, res) => {
  res.json({ message: 'Allowed req from sliding window limiter' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
