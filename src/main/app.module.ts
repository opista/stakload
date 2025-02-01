import { Module } from "./util/module/module.decorator";
import { WindowModule } from "./window/window.module";

@Module({
  imports: [WindowModule],
})
export class AppModule {}
