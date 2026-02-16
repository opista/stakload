import { getCorrelationId } from "@electron-ipc-bridge/core";
import { ConsoleLogger, Injectable, LogLevel } from "@nestjs/common";

@Injectable()
export class CorrelationLogger extends ConsoleLogger {
  protected formatMessage(
    logLevel: LogLevel,
    message: unknown,
    pidMessage: string,
    formattedLogLevel: string,
    contextMessage: string,
    timestampDiff: string,
  ): string {
    const correlationId = getCorrelationId();
    const correlationMessage = correlationId ? `[${correlationId}] ` : "";

    return super.formatMessage(
      logLevel,
      message,
      pidMessage,
      formattedLogLevel,
      correlationMessage + contextMessage,
      timestampDiff,
    );
  }
}
