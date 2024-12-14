import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { Conf } from "electron-conf/main";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { join } from "path";

import {
  CLEAR_SYNC_QUEUE,
  CLOSE_APP,
  CREATE_COLLECTION,
  DECRYPT,
  DELETE_COLLECTION,
  ENCRYPT,
  GET_COLLECTIONS,
  GET_FILTERED_GAMES,
  GET_GAME_BY_ID,
  GET_GAME_FILTERS,
  GET_GAMES_LAST_SYNCED_AT,
  GET_LOCALE,
  GET_OS,
  GET_PROTONDB_TIER,
  OPEN_WEBPAGE,
  REMOVE_GAME,
  RESTART_APP,
  RESTART_DEVICE,
  SHUTDOWN_DEVICE,
  SLEEP_DEVICE,
  SYNC_GAMES,
  TEST_STEAM_INTEGRATION,
  UPDATE_COLLECTION,
} from "../preload/channels";
import { createCollection, deleteCollection, getCollections, updateCollection } from "./channels/collections";
import { GameSyncManager } from "./channels/game-sync-manager";
import {
  getFilteredGameLibrary,
  getGameById,
  getGameFilters,
  getGamesLastSyncedAt,
  getProtondbTier,
  removeGame,
} from "./channels/games";
import { getLocale } from "./channels/get-locale";
import { testSteamIntegration } from "./channels/integrations";
import { openWebpage } from "./channels/open-webpage";
import { getOS } from "./channels/os";
import { closeApp, restartApp, restartDevice, shutdownDevice, sleepDevice } from "./channels/power";
import { decrypt, encrypt } from "./channels/safe-storage";

const conf = new Conf();

conf.registerRendererListener();

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    autoHideMenuBar: true,
    center: true,
    closable: true,
    enableLargerThanScreen: false,
    focusable: true,
    frame: true,
    fullscreenable: true,
    height: 600,
    maximizable: true,
    minimizable: true,
    minHeight: 600,
    minWidth: 800,
    movable: true,
    resizable: true,
    roundedCorners: true,
    show: false,
    title: "Trulaunch",
    width: 800,
    webPreferences: {
      accessibleTitle: "Trulaunch",
      allowRunningInsecureContent: false,
      autoplayPolicy: "document-user-activation-required",
      contextIsolation: true,
      devTools: true,
      enableWebSQL: false,
      experimentalFeatures: false,
      imageAnimationPolicy: "animate",
      images: true,
      javascript: true,
      navigateOnDragDrop: false,
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      plugins: false,
      preload: join(__dirname, "../preload/index.mjs"),
      sandbox: false,
      scrollBounce: false,
      spellcheck: false,
      textAreasAreResizable: false,
      webSecurity: true,
      zoomFactor: 1.0,
    },
  });

  const syncManager = new GameSyncManager(mainWindow.webContents, conf);

  mainWindow.on("ready-to-show", async () => {
    mainWindow.show();

    const shouldAutoSync = conf.get("library_settings.state.syncOnStartup");

    if (shouldAutoSync) {
      syncManager.sync();
    }
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return { browserWindow: mainWindow, syncManager };
}

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

  const { browserWindow, syncManager } = createWindow();

  ipcMain.handle(DECRYPT, decrypt);
  ipcMain.handle(ENCRYPT, encrypt);
  ipcMain.handle(CREATE_COLLECTION, createCollection(browserWindow.webContents));
  ipcMain.handle(GET_COLLECTIONS, getCollections);
  ipcMain.handle(UPDATE_COLLECTION, updateCollection(browserWindow.webContents));
  ipcMain.handle(DELETE_COLLECTION, deleteCollection(browserWindow.webContents));
  ipcMain.handle(GET_FILTERED_GAMES, getFilteredGameLibrary);
  ipcMain.handle(GET_GAME_FILTERS, getGameFilters);
  ipcMain.handle(GET_GAME_BY_ID, getGameById);
  ipcMain.handle(GET_GAMES_LAST_SYNCED_AT, getGamesLastSyncedAt);
  ipcMain.handle(GET_LOCALE, getLocale);
  ipcMain.handle(GET_PROTONDB_TIER, getProtondbTier);
  ipcMain.handle(GET_OS, getOS);
  ipcMain.handle(REMOVE_GAME, removeGame(browserWindow.webContents));
  ipcMain.handle(TEST_STEAM_INTEGRATION, testSteamIntegration);
  ipcMain.on(CLEAR_SYNC_QUEUE, () => syncManager.clear());
  ipcMain.on(CLOSE_APP, closeApp);
  ipcMain.on(OPEN_WEBPAGE, openWebpage);
  ipcMain.on(RESTART_APP, restartApp);
  ipcMain.on(RESTART_DEVICE, restartDevice);
  ipcMain.on(SHUTDOWN_DEVICE, shutdownDevice);
  ipcMain.on(SLEEP_DEVICE, sleepDevice);
  ipcMain.on(SYNC_GAMES, () => syncManager.sync());

  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
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
