export interface RateLimiter {
  acquireTokens(tokens: number): boolean;
}
