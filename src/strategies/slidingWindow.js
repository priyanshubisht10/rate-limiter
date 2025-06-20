import { RateLimiterStrategy } from './abstract.js';

export class SlidingWindowLimiter extends RateLimiterStrategy {
  constructor() {
    super();
  }

  async allowRequest(ip) {
    return true;
  }
}
