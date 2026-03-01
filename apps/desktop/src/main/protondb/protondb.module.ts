import { Module } from "@nestjs/common";

import { ProtondbApiClient } from "./protondb-api.client";

@Module({
  controllers: [],
  exports: [ProtondbApiClient],
  imports: [],
  providers: [ProtondbApiClient],
})
export class ProtonDBModule {}
