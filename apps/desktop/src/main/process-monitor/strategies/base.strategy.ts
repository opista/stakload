import { Logger } from "../../logging/logging.service";
import { ProcessMonitorOptions, ProcessMonitorStrategy } from "../types";

const PROCESS_CHECK_INTERVAL = 5000;

export abstract class BaseProcessMonitor implements ProcessMonitorStrategy {
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
      const processStatuses = await Promise.all(
        pids.map(async (pid) => ({
          isRunning: await this.isProcessRunning(pid),
          pid,
        })),
      );

      for (const { isRunning, pid } of processStatuses) {
        if (isRunning) continue;

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

  protected abstract isProcessRunning(pid: number): Promise<boolean>;

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
