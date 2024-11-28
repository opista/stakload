import { app } from "electron";

import { execAsync } from "../util/exec-async";

export const closeApp = () => {
  app.exit(0);
};

export const restartApp = () => {
  app.relaunch();
  app.exit(0);
};

export const sleepDevice = () => execAsync("%windir%\\System32\\rundll32.exe powrprof.dll,SetSuspendState 0,1,0");

export const restartDevice = () => execAsync("shutdown /r");

export const shutdownDevice = () => execAsync("shutdown /s");
