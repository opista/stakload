import { OnModuleDestroy } from "@nestjs/common";

import { Logger } from "../../logging/logging.service";
import { ProcessMonitorOptions, ProcessMonitorStrategy } from "../types";

const PROCESS_CHECK_INTERVAL = 5000;

export abstract class BaseProcessMonitor implements OnModuleDestroy, ProcessMonitorStrategy {
  private processCheckTimeout: NodeJS.Timeout | null = null;
  private readonly watchedProcesses = new Map<number, () => void>();

  constructor(protected readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  private async checkProcesses(): Promise<void> {
    const pids = Array.from(this.watchedProcesses.keys());
    if (pids.length === 0) {
      this.logger.debug("No more processes to watch, stopping monitor");
      this.processCheckTimeout = null;
      return;
    }

    this.logger.debug("Checking watched processes", {
      pids: pids.join(","),
    });

    try {
      const runningPids = await this.getRunningProcessIds(pids);

      for (const pid of pids) {
        if (runningPids.has(pid)) continue;

        const callback = this.watchedProcesses.get(pid);
        if (!callback) continue;

        this.logger.log("Process terminated", { pid });
        this.watchedProcesses.delete(pid);
        callback();
      }
    } catch (error) {
      this.logger.error("Error checking processes", error);
    }

    if (this.watchedProcesses.size === 0) {
      this.logger.debug("No more processes to watch, stopping monitor");
      this.processCheckTimeout = null;
      return;
    }

    this.scheduleProcessCheck();
  }

  private scheduleProcessCheck(): void {
    this.processCheckTimeout = setTimeout(() => {
      void this.checkProcesses();
    }, PROCESS_CHECK_INTERVAL);
  }

  abstract findProcessByParentDirectory(directory: string): Promise<number | null>;

  protected abstract getRunningProcessIds(pids: number[]): Promise<Set<number>>;

  onModuleDestroy(): void {
    this.stopWatching();
  }

  stopWatching(): void {
    this.logger.debug("Stopping process monitor", {
      watchedCount: this.watchedProcesses.size,
    });

    if (this.processCheckTimeout) {
      clearTimeout(this.processCheckTimeout);
      this.processCheckTimeout = null;
    }

    this.watchedProcesses.clear();
  }

  async waitForProcess(directory: string, options: ProcessMonitorOptions): Promise<number | null> {
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

    this.logger.warn("Process not found after timeout", {
      directory,
      timeoutMs: options.maxPollingTime,
    });
    return null;
  }

  watchProcess(pid: number, onExit: () => void): void {
    this.logger.debug("Setting up process watch", {
      pid,
      watchedCount: this.watchedProcesses.size,
    });
    this.watchedProcesses.set(pid, onExit);

    if (this.processCheckTimeout) return;

    this.scheduleProcessCheck();
  }
}
