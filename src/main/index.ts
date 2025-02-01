import "reflect-metadata";

import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, ipcMain } from "electron";
import { Conf } from "electron-conf/main";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { Container } from "typedi";

import { INTEGRATION_CHANNELS, SECURITY_CHANNELS } from "../preload/channels";
import { AppModule } from "./app.module";
import { authenticateIntegration } from "./channels/integrations";
import { decrypt, encrypt } from "./channels/safe-storage";
import { ModuleRegistry } from "./util/module/module.registry";
import { WindowService } from "./window/window.service";

const conf = new Conf();
conf.registerRendererListener();

// Menu.setApplicationMenu(null);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.opista.trulaunch");

  if (import.meta.env.DEV) {
    installExtension(REACT_DEVELOPER_TOOLS)
      .then((name) => console.log(`Added Extension:  ${name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  await ModuleRegistry.register(AppModule);

  const windowService = Container.get(WindowService);
  const browserWindow = windowService.createWindow();

  // Integration Handlers
  ipcMain.handle(INTEGRATION_CHANNELS.AUTHENTICATE, authenticateIntegration(browserWindow));

  // Security Handlers
  ipcMain.handle(SECURITY_CHANNELS.DECRYPT, decrypt);
  ipcMain.handle(SECURITY_CHANNELS.ENCRYPT, encrypt);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
