/**
 * Token Bucket Algorithm
 */
export class TokenBucket {
  bucketSize: number; // Maximum token the bucket can hold
  refillRate: number; // Number of tokens to add per second
  tokensLeft = 0; // Tokens left in the bucket
  lastFilledAt = new Date().getTime(); // The time the bucket was last filled

  constructor(bucketSize: number, refillRate: number) {
    this.bucketSize = bucketSize;
    this.refillRate = refillRate;
    this.tokensLeft = bucketSize;
  }

  /**
   * Try to acquire given number of tokens
   * if available in the bucket
   * @param tokens
   * @returns
   */
  acquireTokens(tokens = 1): boolean {
    // First, try to add tokens to the bucket based on the time elapsed
    // from the last it was filled
    this.refillBucket();

    if (this.tokensLeft >= tokens) {
      this.tokensLeft -= tokens;
      return true;
    }

    return false;
  }

  private refillBucket(): void {
    const now = new Date().getTime();
    const timeElapsed = (now - this.lastFilledAt) / 1000; // conver to seconds

    // Don't add more tokens than the bucket size
    this.tokensLeft = Math.min(
      this.bucketSize,
      this.tokensLeft + timeElapsed * this.refillRate
    );
    this.lastFilledAt = now;
  }
}

const tokenBucket = new TokenBucket(4, 2);
console.log(tokenBucket.acquireTokens());
console.log(tokenBucket.acquireTokens());
console.log(tokenBucket.acquireTokens());
console.log(tokenBucket.acquireTokens());
console.log(tokenBucket.acquireTokens());
setInterval(() => console.log(tokenBucket.acquireTokens()), 300);
