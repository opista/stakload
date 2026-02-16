import { Module } from "@nestjs/common";

import { WindowController } from "./window.controller";
import { WindowService } from "./window.service";

@Module({
  controllers: [WindowController],
  exports: [WindowService],
  imports: [],
  providers: [WindowService],
})
export class WindowModule {}
