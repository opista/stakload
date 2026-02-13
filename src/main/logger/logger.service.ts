import { correlationStorage } from "@util/ipc/ipc.decorator";
import { app } from "electron";
import path from "path";
import { Service } from "typedi";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const defaultFormat = [
  format.timestamp(),
  format.errors({ stack: true }),
  format.printf(({ constructor, level, message, timestamp, ...metadata }) => {
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
        filename: "stakload-%DATE%.log",
        format: format.combine(...defaultFormat),
        frequency: "1d",
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

  private getCallerInfo() {
    const error = new Error();
    const stack = error.stack?.split("\n")[3];
    const match = stack?.match(/at\s+(.*?)\.(.*?)\s+\(/);
    return match?.[1] || "Unknown";
  }

  private getCorrelationId() {
    return correlationStorage.getStore();
  }

  debug(message: string, context?: Record<string, unknown>) {
    this.logger.debug(message, {
      constructor: this.getCallerInfo(),
      correlationId: this.getCorrelationId(),
      ...context,
    });
  }

  error(message: string, error?: unknown, context?: Record<string, unknown>) {
    this.logger.error(message, {
      constructor: this.getCallerInfo(),
      correlationId: this.getCorrelationId(),
      error,
      ...context,
    });
  }

  info(message: string, context?: Record<string, unknown>) {
    this.logger.info(message, {
      constructor: this.getCallerInfo(),
      correlationId: this.getCorrelationId(),
      ...context,
    });
  }

  warn(message: string, context?: Record<string, unknown>) {
    this.logger.warn(message, {
      constructor: this.getCallerInfo(),
      correlationId: this.getCorrelationId(),
      ...context,
    });
  }
}
