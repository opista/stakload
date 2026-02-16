import { ConsoleLogger, Injectable } from "@nestjs/common";
import { execAsync } from "@util/exec-async";
import { app } from "electron";

// TODO - This is windows-only right now, we need to make it work for mac too when we build gaming mode

@Injectable()
export class SystemService {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(this.constructor.name);
  }

  async restart() {
    this.logger.log("Initiating system restart");
    try {
      await execAsync("shutdown /r");
      this.logger.log("System restart command executed successfully");
    } catch (error) {
      this.logger.error("Failed to restart system", error);
      throw error;
    }
  }

  restartApplication() {
    this.logger.log("Restarting application");
    app.relaunch();
    app.exit(0);
  }

  async shutdown() {
    this.logger.log("Initiating system shutdown");
    try {
      await execAsync("shutdown /s");
      this.logger.log("System shutdown command executed successfully");
    } catch (error) {
      this.logger.error("Failed to shutdown system", error);
      throw error;
    }
  }

  async sleep() {
    this.logger.log("Putting system to sleep");
    try {
      await execAsync("%windir%\\System32\\rundll32.exe powrprof.dll,SetSuspendState 0,1,0");
      this.logger.log("System sleep command executed successfully");
    } catch (error) {
      this.logger.error("Failed to put system to sleep", error);
      throw error;
    }
  }
}
