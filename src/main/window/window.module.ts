import { Module } from "../util/module/module.decorator";
import { WindowController } from "./window.controller";
import { WindowService } from "./window.service";

@Module({
  providers: [WindowService, WindowController],
  exports: [WindowService],
})
export class WindowModule {}
