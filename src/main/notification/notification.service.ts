import { Notification } from "@contracts/store/notification";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { LoggerService } from "../logger/logger.service";
import { WindowService } from "../window/window.service";

type NotificationOptions = Pick<Notification, "icon" | "message" | "title">;

@Service()
export class NotificationService {
  constructor(
    private logger: LoggerService,
    private windowService: WindowService,
  ) {}

  private send(notification: Omit<Notification, "id" | "timestamp">) {
    this.logger.debug("Sending notification", { notification });

    const notificationWithId: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    this.windowService.sendEvent(EVENT_CHANNELS.NOTIFICATION, notificationWithId);
  }

  success(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "success",
    });
  }

  error(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "error",
    });
  }

  warning(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "warning",
    });
  }

  info(notification: NotificationOptions) {
    this.send({
      ...notification,
      type: "info",
    });
  }
}
