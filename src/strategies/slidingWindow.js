import { RateLimiterStrategy } from './abstract.js';

export class SlidingWindowLimiter extends RateLimiterStrategy {
  constructor({ windowSizeInSeconds = 60, maxReq = 5 } = {}) {
    super();
    this.windowSizeInSeconds = windowSizeInSeconds; //size of the sliding window in seconds
    this.maxReq = maxReq; //max allowed requests within the window
    this.counterMap = new Map();
  }

  async allowRequest(ip) {
    const now = Date.now();
    const windowSizeInMs = this.windowSizeInSeconds * 1000; // convert to ms

    //first request from this ip => initialize window counters
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
      //curr window has passed => shift curr to prev and start new window
      data.prev = { ...data.current };
      data.current = {
        count: 1,
        start: now
      };
      this.counterMap.set(ip, data);
      return true;
    }

    // calculate weighted count from curr and prev window
    const weight = (windowSizeInMs - timeSinceWindowStart) / windowSizeInMs;
    const effectiveCount = (data.prev.count * weight) + data.current.count;

    if (effectiveCount < this.maxReq) {   // within allowed limit => increment and allow req
      data.current.count += 1;
      this.counterMap.set(ip, data);
      return true;
    }

    return false; // over the limit => reject

  }
}
