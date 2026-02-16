import { Module } from "@nestjs/common";

import { StakloadApiClient } from "./stakload-api.client";

@Module({
  controllers: [],
  exports: [StakloadApiClient],
  imports: [],
  providers: [StakloadApiClient],
})
export class StackloadAPIModule {}
