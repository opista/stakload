import { Injectable } from "@nestjs/common";
import { exec } from "child_process";
import { promisify } from "util";

import { Logger } from "../../logging/logging.service";
import { ProcessMonitorStrategy } from "../types";

const execAsync = promisify(exec);

@Injectable()
export class MacProcessMonitor implements ProcessMonitorStrategy {
  private processCheckInterval: NodeJS.Timeout | null = null;
  private watchedProcesses: Map<number, () => void> = new Map();

  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
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
      this.logger.error("Failed to find process by directory", error, { directory });
      return null;
    }
  }

  async isProcessRunning(pid: number): Promise<boolean> {
    this.logger.debug("Checking if process is running", { pid });
    try {
      const { stdout } = await execAsync(`ps -p ${pid}`);
      const isRunning = stdout.includes(String(pid));
      this.logger.debug("Process running status checked", { isRunning, pid });
      return isRunning;
    } catch (error) {
      this.logger.error("Failed to check process status", error, { pid });
      return false;
    }
  }

  stopWatching() {
    this.logger.debug("Stopping process monitor", { watchedCount: this.watchedProcesses.size });
    if (this.processCheckInterval) {
      clearTimeout(this.processCheckInterval);
      this.processCheckInterval = null;
    }
    this.watchedProcesses.clear();
  }

  async waitForProcess(
    directory: string,
    options: { maxPollingTime: number; pollingInterval: number },
  ): Promise<number | null> {
    const startTime = Date.now();
    this.logger.debug("Starting to poll for process", { directory });

    while (Date.now() - startTime < options.maxPollingTime) {
      const pid = await this.findProcessByParentDirectory(directory);

      if (pid) {
        this.logger.log("Process found", { directory, pid });
        return pid;
      }

      await new Promise((resolve) => setTimeout(resolve, options.pollingInterval));
    }

    this.logger.warn("Process not found after timeout", { directory, timeoutMs: options.maxPollingTime });
    return null;
  }

  async watchProcess(pid: number, onExit: () => void) {
    this.logger.debug("Setting up process watch", { pid, watchedCount: this.watchedProcesses.size });
    this.watchedProcesses.set(pid, onExit);

    if (this.processCheckInterval) return;

    const checkProcesses = async () => {
      try {
        const pids = Array.from(this.watchedProcesses.keys());
        if (pids.length === 0) {
          this.logger.debug("No more processes to watch, stopping monitor");
          this.processCheckInterval = null;
          return;
        }

        const { stdout } = await execAsync(`ps -p ${pids.join(",")}`);

        for (const [pid, callback] of this.watchedProcesses.entries()) {
          if (!stdout.includes(String(pid))) {
            this.logger.log("Process terminated", { pid });
            this.watchedProcesses.delete(pid);
            callback();
          }
        }

        if (this.watchedProcesses.size > 0) {
          this.processCheckInterval = setTimeout(checkProcesses, 5000);
        } else {
          this.logger.debug("No more processes to watch, stopping monitor");
          this.processCheckInterval = null;
        }
      } catch (error) {
        this.logger.error("Error checking processes", error);
        this.processCheckInterval = setTimeout(checkProcesses, 5000);
      }
    };

    this.processCheckInterval = setTimeout(checkProcesses, 5000);
  }
}
