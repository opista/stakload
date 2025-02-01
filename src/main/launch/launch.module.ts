import { Module } from "../util/module/module.decorator";
import { LaunchService } from "./launch.service";

@Module({
  providers: [LaunchService],
})
export class LaunchModule {}
