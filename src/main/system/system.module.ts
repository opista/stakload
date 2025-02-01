import { Module } from "../util/module/module.decorator";
import { SystemController } from "./system.controller";
import { SystemService } from "./system.service";

@Module({
  providers: [SystemService, SystemController],
})
export class SystemModule {}
