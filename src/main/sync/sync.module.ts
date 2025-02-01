import { Module } from "../util/module/module.decorator";
import { SyncController } from "./sync.controller";
import { SyncService } from "./sync.service";

@Module({
  providers: [SyncService, SyncController],
})
export class SyncModule {}
