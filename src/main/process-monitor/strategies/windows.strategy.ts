import { execAsync } from "@util/exec-async";
import { Service } from "typedi";

import { LoggerService } from "../../logger/logger.service";
import { ProcessMonitorStrategy } from "../types";

@Service()
export class WindowsProcessMonitor implements ProcessMonitorStrategy {
  private watchedProcesses: Map<number, () => void> = new Map();
  private processCheckInterval: NodeJS.Timeout | null = null;

  constructor(private readonly logger: LoggerService) {}

  async isProcessRunning(pid: number): Promise<boolean> {
    this.logger.debug("Checking if process is running", { pid });
    try {
      const { stdout } = await execAsync(`tasklist /FI "PID eq ${pid}" /NH`);
      const isRunning = stdout.trim().length > 0;
      this.logger.debug("Process running status checked", { pid, isRunning });
      return isRunning;
    } catch (error) {
      this.logger.error("Failed to check process status", error, { pid });
      return false;
    }
  }

  async findProcessByInstallPath(installPath: string): Promise<number | null> {
    this.logger.debug("Finding process by install path", { installPath });
    try {
      // Use wmic to get process info with path
      const sanitizedPath = installPath.replace(/\\/g, "\\\\");
      const { stdout } = await execAsync(`wmic process where "ExecutablePath like '%${sanitizedPath}%'" get ProcessId`);

      // Parse the output - skip header line
      const lines = stdout.split("\n").slice(1);
      const pid = parseInt(lines[0], 10);

      if (!isNaN(pid)) {
        this.logger.info("Process found for install path", { installPath, pid });
      } else {
        this.logger.debug("No process found for install path", { installPath });
      }

      return isNaN(pid) ? null : pid;
    } catch (error) {
      this.logger.error("Failed to find process by install path", error, { installPath });
      return null;
    }
  }

  async watchProcess(pid: number, onExit: () => void) {
    this.logger.debug("Setting up process watch", { pid, watchedCount: this.watchedProcesses.size });
    this.watchedProcesses.set(pid, onExit);

    if (this.processCheckInterval) return;

    this.processCheckInterval = setInterval(async () => {
      try {
        // Batch check all watched processes in one command
        const pids = Array.from(this.watchedProcesses.keys()).join(",");
        this.logger.debug("Checking watched processes", { pids });

        const { stdout } = await execAsync(`tasklist /FI "PID eq ${pids}" /NH /FO CSV`);

        // Get list of running PIDs from output
        const runningPids = stdout
          .split("\n")
          .filter(Boolean)
          .map((line) => {
            const match = line.match(/".*?","\d+",/);
            return match ? parseInt(match[0].split(",")[1].replace(/"/g, "")) : null;
          })
          .filter((pid): pid is number => pid !== null);

        // Check for exited processes
        for (const [pid, callback] of this.watchedProcesses.entries()) {
          if (!runningPids.includes(pid)) {
            this.logger.info("Process terminated", { pid });
            this.watchedProcesses.delete(pid);
            callback();
          }
        }

        // Clean up interval if no more processes to watch
        if (this.watchedProcesses.size === 0) {
          this.logger.debug("No more processes to watch, stopping monitor");
          this.stopWatching();
        }
      } catch (error) {
        this.logger.error("Error checking processes", error);
      }
    }, 5000); // Check every 5 seconds
  }

  stopWatching() {
    this.logger.debug("Stopping process monitor", { watchedCount: this.watchedProcesses.size });
    if (this.processCheckInterval) {
      clearInterval(this.processCheckInterval);
      this.processCheckInterval = null;
    }
    this.watchedProcesses.clear();
  }
}
