import { app } from "electron";
import { Service } from "typedi";

import { execAsync } from "../util/exec-async";

// TODO - This is windows-only I think, we need to make it work for mac too
@Service()
export class SystemService {
  restartApplication() {
    app.relaunch();
    app.exit(0);
  }

  getLocale() {
    return app.getSystemLocale();
  }

  async restart() {
    await execAsync("shutdown /r");
  }

  async shutdown() {
    await execAsync("shutdown /s");
  }

  async sleep() {
    await execAsync("%windir%\\System32\\rundll32.exe powrprof.dll,SetSuspendState 0,1,0");
  }
}
