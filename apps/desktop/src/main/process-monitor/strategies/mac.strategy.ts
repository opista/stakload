import { Injectable } from "@nestjs/common";

import { execAsync } from "@util/exec-async";

import { Logger } from "../../logging/logging.service";
import { BaseProcessMonitor } from "./base.strategy";

@Injectable()
export class MacProcessMonitor extends BaseProcessMonitor {
  constructor(logger: Logger) {
    super(logger);
  }

  async findProcessByParentDirectory(directory: string): Promise<number | null> {
    this.logger.debug("Finding process by directory", { directory });
    try {
      const { stdout } = await execAsync("ps -eo pid,command");
      const lines = stdout.split("\n");

      for (const line of lines) {
        const [pidStr, ...cmdParts] = line.trim().split(/\s+/);
        const cmd = cmdParts.join(" ");

        if (cmd.includes(directory)) {
          const pid = parseInt(pidStr, 10);
          this.logger.log("Process found for directory", { directory, pid });
          return pid;
        }
      }

      this.logger.debug("No process found for directory", { directory });
      return null;
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
      const { stdout } = await execAsync(`ps -p ${pids.join(",")} -o pid=`);
      const runningPids = stdout
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
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
