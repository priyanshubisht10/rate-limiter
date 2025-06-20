import { RateLimiterStrategy } from './abstract.js';

export class SlidingWindowLimiter extends RateLimiterStrategy {
  constructor({ windowSizeInSeconds = 60, maxReq = 5 } = {}) {
    super();
    this.windowSizeInSeconds = windowSizeInSeconds;
    this.maxReq = maxReq;
    this.counterMap = new Map();
  }

  async allowRequest(ip) {
    const now = Date.now();
    const windowSizeInMs = this.windowSizeInSeconds * 1000;

    if (!this.counterMap.has(ip)) {
      this.counterMap.set(ip, {
        current: {
          count: 1,
          start: now
        },
        prev: {
          count: 0,
          start: now - windowSizeInMs
        }
      });
      return true;
    }

    const data = this.counterMap.get(ip);
    const timeSinceWindowStart = now - data.current.start;

    if (timeSinceWindowStart > windowSizeInMs) {
      data.prev = { ...data.current };
      data.current = {
        count: 1,
        start: now
      };
      this.counterMap.set(ip, data);
      return true;
    }

    const weight = (windowSizeInMs - timeSinceWindowStart) / windowSizeInMs;
    const effectiveCount = (data.prev.count * weight) + data.current.count;

    if (effectiveCount < this.maxReq) {
      data.current.count += 1;
      this.counterMap.set(ip, data);
      return true;
    }

    return false;
  }
}
