import { Module } from "@nestjs/common";

import { IgdbApiClient } from "./igdb-api.client";
import { IgdbApiService } from "./igdb-api.service";

@Module({
  exports: [IgdbApiService],
  providers: [IgdbApiClient, IgdbApiService],
})
export class IgdbApiModule {}
