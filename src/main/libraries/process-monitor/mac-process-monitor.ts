import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export class MacProcessMonitor {
  // eslint-disable-next-line no-undef
  private processCheckInterval: NodeJS.Timeout | null = null;

  async isProcessRunning(pid: number): Promise<boolean> {
    try {
      const { stdout } = await execAsync(`ps -p ${pid}`);
      return stdout.includes(String(pid));
    } catch {
      return false;
    }
  }

  async findProcessByInstallPath(installPath: string): Promise<number | null> {
    try {
      // List all processes and their working directories
      const { stdout } = await execAsync("ps -eo pid,command");
      const lines = stdout.split("\n");

      // Find process that matches install path
      for (const line of lines) {
        const [pidStr, ...cmdParts] = line.trim().split(/\s+/);
        const cmd = cmdParts.join(" ");

        if (cmd.includes(installPath)) {
          return parseInt(pidStr, 10);
        }
      }

      return null;
    } catch (error) {
      console.error("Error finding process:", error);
      return null;
    }
  }

  async watchProcess(pid: number, onExit: () => void) {
    if (this.processCheckInterval) {
      clearInterval(this.processCheckInterval);
    }

    this.processCheckInterval = setInterval(async () => {
      const isRunning = await this.isProcessRunning(pid);
      if (!isRunning) {
        clearInterval(this.processCheckInterval!);
        this.processCheckInterval = null;
        onExit();
      }
    }, 5000); // Check every 5 seconds
  }

  stopWatching() {
    if (this.processCheckInterval) {
      clearInterval(this.processCheckInterval);
      this.processCheckInterval = null;
    }
  }
}
