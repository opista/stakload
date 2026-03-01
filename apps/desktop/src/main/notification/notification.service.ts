import { Injectable } from "@nestjs/common";
import { Notification } from "@stakload/contracts/store/notification";

import { EVENT_CHANNELS } from "../../preload/channels";
import { Logger } from "../logging/logging.service";
import { WindowService } from "../window/window.service";

type NotificationOptions = Pick<Notification, "icon" | "message" | "title">;

@Injectable()
export class NotificationService {
  constructor(
    private logger: Logger,
    private windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private send(notification: Omit<Notification, "id" | "timestamp">) {
    this.logger.debug("Sending notification", { notification });

    const notificationWithId: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    this.windowService.sendEvent(EVENT_CHANNELS.NOTIFICATION, notificationWithId);
  }

  error(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "error",
    });
  }

  info(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "info",
    });
  }

  success(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "success",
    });
  }

  warning(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "warning",
    });
  }
}
