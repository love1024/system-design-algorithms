import { RateLimiter } from "./ratelimiter";

export class LeakingBucket implements RateLimiter {
  bucketSize: number; // Maximum bucket size allowed
  outflowRate: number; // How many requests are processed in a second
  currentSize = 0; // Current requests in the queue
  lastRequestAt = new Date().getTime(); // last request time

  constructor(bucketSize: number, outflowRate: number) {
    this.bucketSize = bucketSize;
    this.outflowRate = outflowRate;
  }

  acquireTokens(tokens = 1): boolean {
    // First check, how many requests are processed from the last request
    this.leak();

    if (this.currentSize + tokens <= this.bucketSize) {
      this.currentSize += tokens;
      // Update only for successfully added requests to the queue, not for ignored once
      // Otherwise, it will never empty queue, if requests keep coming.
      this.lastRequestAt = new Date().getTime();
      return true;
    }

    return false;
  }

  private leak(): void {
    const now = new Date().getTime();
    const elapsedTime = Math.floor((now - this.lastRequestAt) / 1000);
    const requestsProssed = elapsedTime * this.outflowRate;
    this.currentSize = Math.max(0, this.currentSize - requestsProssed);
  }
}

const leakingBucket = new LeakingBucket(4, 2);
console.log(leakingBucket.acquireTokens());
console.log(leakingBucket.acquireTokens());
console.log(leakingBucket.acquireTokens());
console.log(leakingBucket.acquireTokens());
console.log(leakingBucket.acquireTokens());
setInterval(() => console.log(leakingBucket.acquireTokens()), 300);
