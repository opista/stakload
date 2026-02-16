import "reflect-metadata";

import { createIpcApp, type IpcAppOptions } from "@electron-ipc-bridge/core";
import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app } from "electron";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";

import { CollectionController } from "./collection/collection.controller";
import { Container } from "./container";
import { GameController } from "./game/game.controller";
import { SyncController } from "./sync/sync.controller";
import { SystemController } from "./system/system.controller";
import { WindowController } from "./window/window.controller";
import { WindowService } from "./window/window.service";

// Menu.setApplicationMenu(null);

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
void app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.opista.stakload");

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

  const ipcApp = createIpcApp({
    controllers: [
      CollectionController,
      GameController,
      SyncController,
      SystemController,
      WindowController,
    ] as IpcAppOptions["controllers"],
    correlation: true,
    resolver: {
      resolve: (Token) => Container.get(Token),
    },
  });

  const windowService = Container.get(WindowService);
  windowService.createWindow();

  app.on("window-all-closed", () => {
    app.quit();
    ipcApp.dispose();
  });
});
