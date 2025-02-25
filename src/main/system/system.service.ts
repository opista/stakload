import { execAsync } from "@util/exec-async";
import { app } from "electron";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

// TODO - This is windows-only right now, we need to make it work for mac too when we build gaming mode
@Service()
export class SystemService {
  constructor(private readonly logger: LoggerService) {}

  restartApplication() {
    this.logger.info("Restarting application");
    app.relaunch();
    app.exit(0);
  }

  async restart() {
    this.logger.info("Initiating system restart");
    try {
      await execAsync("shutdown /r");
      this.logger.info("System restart command executed successfully");
    } catch (error) {
      this.logger.error("Failed to restart system", error);
      throw error;
    }
  }

  async shutdown() {
    this.logger.info("Initiating system shutdown");
    try {
      await execAsync("shutdown /s");
      this.logger.info("System shutdown command executed successfully");
    } catch (error) {
      this.logger.error("Failed to shutdown system", error);
      throw error;
    }
  }

  async sleep() {
    this.logger.info("Putting system to sleep");
    try {
      await execAsync("%windir%\\System32\\rundll32.exe powrprof.dll,SetSuspendState 0,1,0");
      this.logger.info("System sleep command executed successfully");
    } catch (error) {
      this.logger.error("Failed to put system to sleep", error);
      throw error;
    }
  }
}
