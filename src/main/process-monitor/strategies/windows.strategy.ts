import { execAsync } from "../../util/exec-async";
import { ProcessMonitorStrategy } from "../types";

export class WindowsProcessMonitor implements ProcessMonitorStrategy {
  private watchedProcesses: Map<number, () => void> = new Map();
  // eslint-disable-next-line no-undef
  private processCheckInterval: NodeJS.Timeout | null = null;

  async isProcessRunning(pid: number): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`tasklist /FI "PID eq ${pid}" /NH`);
      return stdout.trim().length > 0;
    } catch {
      return false;
    }
  }

  async findProcessByInstallPath(installPath: string): Promise<number | null> {
    try {
      // Use wmic to get process info with path
      const sanitizedPath = installPath.replace(/\\/g, "\\\\");
      const { stdout } = await execAsync(`wmic process where "ExecutablePath like '%${sanitizedPath}%'" get ProcessId`);

      // Parse the output - skip header line
      const lines = stdout.split("\n").slice(1);
      const pid = parseInt(lines[0], 10);

      return isNaN(pid) ? null : pid;
    } catch {
      return null;
    }
  }

  async watchProcess(pid: number, onExit: () => void) {
    this.watchedProcesses.set(pid, onExit);

    if (this.processCheckInterval) return;

    this.processCheckInterval = setInterval(async () => {
      try {
        // Batch check all watched processes in one command
        const pids = Array.from(this.watchedProcesses.keys()).join(",");
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
            this.watchedProcesses.delete(pid);
            callback();
          }
        }

        // Clean up interval if no more processes to watch
        if (this.watchedProcesses.size === 0) {
          this.stopWatching();
        }
      } catch (error) {
        console.error("Error checking processes:", error);
      }
    }, 5000); // Check every 5 seconds
  }

  stopWatching() {
    if (this.processCheckInterval) {
      clearInterval(this.processCheckInterval);
      this.processCheckInterval = null;
    }
    this.watchedProcesses.clear();
  }
}
