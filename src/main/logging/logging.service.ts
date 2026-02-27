/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable, Logger as NestLogger, Scope } from "@nestjs/common";

@Injectable({ scope: Scope.TRANSIENT })
export class Logger extends NestLogger {
  private processLog(type: "log" | "debug" | "warn", message: any, meta?: any) {
    if (meta && typeof meta === "object") {
      super[type]({ message, ...meta }, this.context);
    } else if (meta !== undefined) {
      super[type](message, meta, this.context);
    } else {
      super[type](message, this.context);
    }
  }

  debug(message: any, meta?: any) {
    this.processLog("debug", message, meta);
  }

  error(message: any, stackOrMeta?: any, contextOrMeta?: any) {
    if (!contextOrMeta && stackOrMeta && typeof stackOrMeta === "object") {
      super.error({ message, ...stackOrMeta }, this.context);
    } else if (contextOrMeta) {
      super.error(message, stackOrMeta, contextOrMeta);
    } else if (stackOrMeta !== undefined) {
      super.error(message, stackOrMeta, this.context);
    } else {
      super.error(message, this.context);
    }
  }

  log(message: any, meta?: any) {
    this.processLog("log", message, meta);
  }

  public setContext(context: string) {
    this.context = context;
  }

  warn(message: any, meta?: any) {
    this.processLog("warn", message, meta);
  }
}
