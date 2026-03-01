type LogLevel = "log" | "error" | "warn" | "debug" | "verbose";

const log = (level: LogLevel, message: string, context?: string) => {
  // Send to main process to be written to the log file via IPC
  if (window.ipc?.logging?.rendererLog) {
    window.ipc.logging.rendererLog(level, message, context);
  }

  // Also print to DevTools console for DX
  const prefix = context ? `[${context}]` : "";
  const consoleFn = level === "log" ? console.log : console[level];
  consoleFn(`${prefix} ${message}`);
};

export const logger = {
  debug: (message: string, context?: string) => log("debug", message, context),
  error: (message: string, context?: string) => log("error", message, context),
  log: (message: string, context?: string) => log("log", message, context),
  verbose: (message: string, context?: string) => log("verbose", message, context),
  warn: (message: string, context?: string) => log("warn", message, context),
};
