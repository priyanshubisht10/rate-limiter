import { RateLimiterStrategy } from './abstract.js';

export class LeakyBucketLimiter extends RateLimiterStrategy {
  constructor({ leakRate = 1, capacity = 5 } = {}) {
    super();
    this.leakRate = leakRate;
    this.capacity = capacity;
    this.bucketMap = new Map();
  }

  async allowRequest(ip) {
    const now = Date.now();

    if (!this.bucketMap.has(ip)) {
      this.bucketMap.set(ip, { queue: 1, lastCheck: now });
      return true;
    }

    const bucket = this.bucketMap.get(ip);
    const elapsed = (now - bucket.lastCheck) / 1000;
    const leaked = Math.floor(elapsed * this.leakRate);

    bucket.queue = Math.max(0, bucket.queue - leaked);
    bucket.lastCheck = now;

    if (bucket.queue < this.capacity) {
      bucket.queue += 1;
      this.bucketMap.set(ip, bucket);
      return true;
    }

    return false;
  }
}

