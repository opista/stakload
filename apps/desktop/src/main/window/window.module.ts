import { Module } from "@nestjs/common";

import { WindowService } from "./window.service";

@Module({
  controllers: [],
  exports: [WindowService],
  imports: [],
  providers: [WindowService],
})
export class WindowModule {}
