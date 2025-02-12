import { correlationStorage } from "@util/ipc/ipc.decorator";
import { app } from "electron";
import path from "path";
import { Service } from "typedi";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const defaultFormat = [
  format.timestamp(),
  format.errors({ stack: true }),
  format.printf(({ timestamp, level, message, constructor, ...metadata }) => {
    const stringifiedMetadata = JSON.stringify(metadata);
    const metadataStr = stringifiedMetadata !== "{}" ? ` | ${stringifiedMetadata}` : "";
    return `${timestamp} [${level}] [${constructor}] ${message}${metadataStr}`;
  }),
];

@Service()
export class LoggerService {
  private logger = createLogger({
    format: format.combine(...defaultFormat),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize(), ...defaultFormat),
        level: process.env.NODE_ENV === "development" ? "debug" : "info",
      }),
      new DailyRotateFile({
        datePattern: "YYYY-MM-DD",
        dirname: path.join(app.getPath("userData"), "logs"),
        filename: "trulaunch-%DATE%.log",
        frequency: "1d",
        format: format.combine(...defaultFormat),
        level: "debug",
        maxFiles: "7d",
        maxSize: "1m",
      }),
    ],
  });

  constructor() {
    this.logger.on("error", (error) => {
      console.error("Logger error:", error);
    });
  }

  private getCorrelationId() {
    return correlationStorage.getStore();
  }

  private getCallerInfo() {
    const error = new Error();
    const stack = error.stack?.split("\n")[3];
    const match = stack?.match(/at\s+(.*?)\.(.*?)\s+\(/);
    return match?.[1] || "Unknown";
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.logger.error(message, {
      correlationId: this.getCorrelationId(),
      constructor: this.getCallerInfo(),
      error,
      ...context,
    });
  }

  info(message: string, context?: Record<string, unknown>) {
    this.logger.info(message, {
      correlationId: this.getCorrelationId(),
      constructor: this.getCallerInfo(),
      ...context,
    });
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.logger.debug(message, {
      correlationId: this.getCorrelationId(),
      constructor: this.getCallerInfo(),
      ...context,
    });
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.logger.warn(message, {
      correlationId: this.getCorrelationId(),
      constructor: this.getCallerInfo(),
      ...context,
    });
  }
}
