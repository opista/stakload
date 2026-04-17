export const PROCESS_MONITOR = Symbol("PROCESS_MONITOR");

export interface ProcessMonitorOptions {
  maxPollingTime: number;
  pollingInterval: number;
}

export interface ProcessMonitorStrategy {
  findProcessByParentDirectory(directory: string): Promise<number | null>;
  waitForProcess(directory: string, options: ProcessMonitorOptions): Promise<number | null>;
  watchProcess(pid: number, onExit: () => void): void;
}
