import "reflect-metadata";
import "./app-paths";

import { createIpcApp } from "@electron-ipc-bridge/core";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { NestFactory } from "@nestjs/core";
import { app } from "electron";
import { WinstonModule } from "nest-winston";

import { IpcModule } from "./ipc.module";
import { winstonInstance } from "./logging/winston.setup";
import { getIpcControllers } from "./util/get-ipc-controllers";
import { WindowService } from "./window/window.service";

// Menu.setApplicationMenu(null);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
void app.whenReady().then(async () => {
  const nestContext = await NestFactory.createApplicationContext(IpcModule, {
    logger: WinstonModule.createLogger({ instance: winstonInstance }),
  });
  const windowService = nestContext.get(WindowService);

  // Set app user model id for windows
  electronApp.setAppUserModelId("com.opista.stakload");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const ipcApp = createIpcApp({
    controllers: getIpcControllers(nestContext),
    correlation: true,
    resolver: {
      resolve: <T>(Controller: new (...args: unknown[]) => T): T => nestContext.get(Controller),
    },
  });

  windowService.createWindow();

  app.on("window-all-closed", () => {
    app.quit();
    ipcApp.dispose();
  });
});
