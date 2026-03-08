import { Module } from "@nestjs/common";

import { RateLimiterModule } from "../rate-limiter/rate-limiter.module";
import { IgdbApiClient } from "./igdb-api.client";
import { IgdbApiService } from "./igdb-api.service";
import { IgdbTokenService } from "./igdb-token.service";

const IGDB_MAX_CONCURRENT_REQUESTS = 8;
const IGDB_MIN_REQUEST_INTERVAL_MS = 250;

@Module({
  exports: [IgdbApiService],
  imports: [
    RateLimiterModule.register({ maxConcurrent: IGDB_MAX_CONCURRENT_REQUESTS, minTime: IGDB_MIN_REQUEST_INTERVAL_MS }),
  ],
  providers: [IgdbApiClient, IgdbApiService, IgdbTokenService],
})
export class IgdbApiModule {}
