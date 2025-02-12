import { exec } from "child_process";
import { Service } from "typedi";
import { promisify } from "util";

import { LoggerService } from "../../logger/logger.service";
import { ProcessMonitorStrategy } from "../types";

const execAsync = promisify(exec);

@Service()
export class MacProcessMonitor implements ProcessMonitorStrategy {
  private processCheckInterval: NodeJS.Timeout | null = null;

  constructor(private readonly logger: LoggerService) {}

  async isProcessRunning(pid: number): Promise<boolean> {
    this.logger.debug("Checking if process is running", { pid });
    try {
      const { stdout } = await execAsync(`ps -p ${pid}`);
      const isRunning = stdout.includes(String(pid));
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
      // List all processes and their working directories
      const { stdout } = await execAsync("ps -eo pid,command");
      const lines = stdout.split("\n");

      // Find process that matches install path
      for (const line of lines) {
        const [pidStr, ...cmdParts] = line.trim().split(/\s+/);
        const cmd = cmdParts.join(" ");

        if (cmd.includes(installPath)) {
          const pid = parseInt(pidStr, 10);
          this.logger.info("Process found for install path", { installPath, pid });
          return pid;
        }
      }

      this.logger.debug("No process found for install path", { installPath });
      return null;
    } catch (error) {
      this.logger.error("Failed to find process by install path", error, { installPath });
      return null;
    }
  }

  async watchProcess(pid: number, onExit: () => void) {
    this.logger.debug("Setting up process watch", { pid });

    if (this.processCheckInterval) {
      this.logger.debug("Clearing existing process watch interval");
      clearInterval(this.processCheckInterval);
    }

    this.processCheckInterval = setInterval(async () => {
      const isRunning = await this.isProcessRunning(pid);
      if (!isRunning) {
        this.logger.info("Process terminated", { pid });
        clearInterval(this.processCheckInterval!);
        this.processCheckInterval = null;
        onExit();
      }
    }, 5000);
  }

  stopWatching() {
    this.logger.debug("Stopping process monitor");
    if (this.processCheckInterval) {
      clearInterval(this.processCheckInterval);
      this.processCheckInterval = null;
    }
  }
}
