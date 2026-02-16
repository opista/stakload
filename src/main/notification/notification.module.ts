import { Module } from "@nestjs/common";

import { WindowModule } from "../window/window.module";

import { NotificationService } from "./notification.service";

@Module({
  controllers: [],
  exports: [NotificationService],
  imports: [WindowModule],
  providers: [NotificationService],
})
export class NotificationModule {}
