import { DynamicModule, Module } from "@nestjs/common";

import { RATE_LIMITER_OPTIONS } from "./rate-limiter.constants";
import { RateLimiterService } from "./rate-limiter.service";
import type { RateLimiterOptions } from "./rate-limiter.types";

@Module({})
export class RateLimiterModule {
  static register(options: RateLimiterOptions): DynamicModule {
    return {
      exports: [RateLimiterService],
      module: RateLimiterModule,
      providers: [{ provide: RATE_LIMITER_OPTIONS, useValue: options }, RateLimiterService],
    };
  }
}
