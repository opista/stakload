import { getCorrelationId } from "@electron-ipc-bridge/core";
import { app } from "electron";
import { utilities as nestWinstonUtils } from "nest-winston";
import { createLogger, format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const correlationFormat = format((info) => {
  const id = getCorrelationId();
  if (id) {
    info.message = `[${id}] ${info.message}`;
  }
  return info;
});

export const winstonInstance = createLogger({
  level: "debug",
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.ms(),
        correlationFormat(),
        nestWinstonUtils.format.nestLike("Main", {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
    new DailyRotateFile({
      datePattern: "YYYY-MM-DD",
      dirname: app.getPath("logs"),
      filename: "stakload-%DATE%.log",
      format: format.combine(
        format.timestamp(),
        format.ms(),
        correlationFormat(),
        nestWinstonUtils.format.nestLike("Main", {
          colors: false,
          prettyPrint: true,
        }),
      ),
      maxFiles: "7d",
      maxSize: "10m",
    }),
  ],
});
