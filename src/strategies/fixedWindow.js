import { RateLimiterStrategy } from './abstract.js';

export class FixedWindowLimiter extends RateLimiterStrategy {
  constructor({ windowSizeInSeconds = 60, maxReq = 5 } = {}) {
    super();
    this.windowSizeInSeconds = windowSizeInSeconds;
    this.maxReq = maxReq;
    this.requestMap = new Map();
  }

  async allowRequest(ip) {
    const now = Date.now();
    const currentWindow = Math.floor(now / 1000 / this.windowSizeInSeconds); 

    if (!this.requestMap.has(ip)) {
      this.requestMap.set(ip, {
        count: 1,
        window: currentWindow,
      });
      return true;
    }

    const entry = this.requestMap.get(ip);

    if (entry.window === currentWindow) {
      if (entry.count < this.maxReq) {
        entry.count += 1;
        this.requestMap.set(ip, entry);
        return true;
      }
      return false;
    } else {
      this.requestMap.set(ip, {
        count: 1,
        window: currentWindow,
      });
      return true;
    }
  }
}
