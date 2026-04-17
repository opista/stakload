import { Injectable } from "@nestjs/common";

import { execAsync } from "@util/exec-async";

import { Logger } from "../../logging/logging.service";
import { BaseProcessMonitor } from "./base.strategy";

@Injectable()
export class WindowsProcessMonitor extends BaseProcessMonitor {
  constructor(logger: Logger) {
    super(logger);
  }

  async findProcessByParentDirectory(directory: string): Promise<number | null> {
    this.logger.debug("Finding process launched from directory", { directory });
    try {
      const sanitizedPath = directory.replace(/\\/g, "\\\\");
      const { stdout } = await execAsync(`wmic process where "ExecutablePath like '%${sanitizedPath}%'" get ProcessId`);

      const lines = stdout.split("\n").slice(1);
      const pid = parseInt(lines[0], 10);

      if (!isNaN(pid)) {
        this.logger.log("Process found for directory", { directory, pid });
      } else {
        this.logger.debug("No process found for directory", { directory });
      }

      return isNaN(pid) ? null : pid;
    } catch (error) {
      this.logger.error("Failed to find process by directory", error, {
        directory,
      });
      return null;
    }
  }

  protected async isProcessRunning(pid: number): Promise<boolean> {
    this.logger.debug("Checking if process is running", { pid });
    try {
      const { stdout } = await execAsync(`tasklist /FI "PID eq ${pid}" /NH`);
      const isRunning = stdout.trim().length > 0;
      this.logger.debug("Process running status checked", { isRunning, pid });
      return isRunning;
    } catch (error) {
      this.logger.error("Failed to check process status", error, { pid });
      return false;
    }
  }
}
