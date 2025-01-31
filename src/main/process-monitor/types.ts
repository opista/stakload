export interface ProcessMonitorStrategy {
  findProcessByInstallPath(installPath: string): Promise<number | null>;
  watchProcess(pid: number, onExit: () => void): void;
}
