import { Inject, Injectable } from "@nestjs/common";

import { RATE_LIMITER_OPTIONS } from "./rate-limiter.constants";
import type { RateLimiterOptions } from "./rate-limiter.types";

@Injectable()
export class RateLimiterService {
  private availableSlots: number;
  private nextRequestAvailableAt = 0;
  private slotWaiters: Array<() => void> = [];

  constructor(@Inject(RATE_LIMITER_OPTIONS) private readonly options: RateLimiterOptions) {
    this.availableSlots = options.maxConcurrent;
  }

  private async acquireSlot(): Promise<void> {
    if (this.availableSlots > 0) {
      this.availableSlots -= 1;

      return;
    }

    await new Promise<void>((resolve) => {
      this.slotWaiters.push(resolve);
    });
  }

  private releaseSlot(): void {
    const next = this.slotWaiters.shift();

    if (next !== undefined) {
      next();

      return;
    }

    this.availableSlots = Math.min(this.availableSlots + 1, this.options.maxConcurrent);
  }

  private async waitForRateLimit(): Promise<void> {
    const now = Date.now();
    const waitMs = Math.max(0, this.nextRequestAvailableAt - now);
    this.nextRequestAvailableAt = Math.max(now, this.nextRequestAvailableAt) + this.options.minTime;

    if (waitMs > 0) {
      await new Promise<void>((resolve) => setTimeout(resolve, waitMs));
    }
  }

  async schedule<T>(fn: () => Promise<T>): Promise<T> {
    await this.waitForRateLimit();
    await this.acquireSlot();

    try {
      return await fn();
    } finally {
      this.releaseSlot();
    }
  }
}
