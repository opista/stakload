export interface ProcessMonitorStrategy {
  findProcessByParentDirectory(directory: string): Promise<number | null>;
  waitForProcess(
    directory: string,
    options: { maxPollingTime: number; pollingInterval: number },
  ): Promise<number | null>;
  watchProcess(pid: number, onExit: () => void): void;
}
