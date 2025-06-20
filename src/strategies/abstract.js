//base class to implement stratergies

export class RateLimiterStrategy {
  async allowRequest(ip) {
    throw new Error("allowRequest(ip) method must be implemented by subclass");
  }
}
