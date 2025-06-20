import { RateLimiterStrategy } from './abstract.js';

export class TokenBucketLimiter extends RateLimiterStrategy {
  constructor({ refillRate = 1, capacity = 5 } = {}) {
    super();
    this.refillRate = refillRate; //no of tokens added per second
    this.capacity = capacity; //max tokens each user/ip can have
    this.bucketMap = new Map();
  }

  async allowRequest(ip) {
    const now = Date.now();

    if (!this.bucketMap.has(ip)) {
      this.bucketMap.set(ip, {
        tokens: this.capacity - 1,
        lastRefill: now,
      });
      return true;
    }

    const bucket = this.bucketMap.get(ip);
    const elapsed = (now - bucket.lastRefill) / 1000;
    const tokensToAdd = elapsed * this.refillRate; //if elapsed time is more than 1s => capacity is again put back to full

    bucket.tokens = Math.min(this.capacity, bucket.tokens + tokensToAdd); //not allow token mining
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      this.bucketMap.set(ip, bucket);
      return true;
    }

    return false;
  }
}
