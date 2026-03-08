export interface RateLimiterOptions {
  /** Maximum number of requests allowed to be in-flight at the same time. */
  maxConcurrent: number;

  /** Minimum time in milliseconds between consecutive request starts. */
  minTime: number;
}
