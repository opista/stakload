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

  protected async getRunningProcessIds(pids: number[]): Promise<Set<number>> {
    this.logger.debug("Checking watched process status", {
      pids: pids.join(","),
    });

    if (pids.length === 0) {
      return new Set();
    }

    try {
      const query = pids.map((pid) => `ProcessId=${pid}`).join(" or ");
      const { stdout } = await execAsync(`wmic process where "${query}" get ProcessId`);
      const runningPids = stdout
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => line !== "ProcessId")
        .map((line) => parseInt(line, 10))
        .filter((pid): pid is number => !isNaN(pid));

      this.logger.debug("Process running status checked", {
        runningPids: runningPids.join(","),
      });
      return new Set(runningPids);
    } catch (error) {
      this.logger.error("Failed to check process status", error, {
        pids: pids.join(","),
      });
      return new Set();
    }
  }
}
