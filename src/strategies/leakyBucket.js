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

    // first req from this ip => init queue and allow
    if (!this.bucketMap.has(ip)) {
      this.bucketMap.set(ip, { queue: 1, lastCheck: now });
      return true;
    }

    const bucket = this.bucketMap.get(ip);
    const elapsed = (now - bucket.lastCheck) / 1000; //time since last check in seconds
    const leaked = Math.floor(elapsed * this.leakRate); // calculate no of req leaked

    bucket.queue = Math.max(0, bucket.queue - leaked);
    bucket.lastCheck = now;

    if (bucket.queue < this.capacity) { // queue has space => accept the req
      bucket.queue += 1;
      this.bucketMap.set(ip, bucket);
      return true;
    }
      
    return false; // bucket full => reject req
  }
}

