import { Library } from "@contracts/database/games";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { Conf } from "electron-conf/main";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { join } from "path";

import {
  AUTHENTICATE_INTEGRATION,
  CLEAR_SYNC_QUEUE,
  CREATE_COLLECTION,
  DECRYPT,
  DELETE_COLLECTION,
  ENCRYPT,
  GET_COLLECTION_GAMES,
  GET_COLLECTIONS,
  GET_FILTERED_GAMES,
  GET_GAME_BY_ID,
  GET_GAME_FILTERS,
  GET_GAMES_LAST_SYNCED_AT,
  GET_GAMES_LIST,
  GET_LOCALE,
  GET_NEW_GAMES,
  GET_OS,
  GET_PROTONDB_TIER,
  GET_QUICK_ACCESS_GAMES,
  INSTALL_GAME,
  LAUNCH_GAME,
  REMOVE_GAME,
  RESTART_APP,
  RESTART_DEVICE,
  SHUTDOWN_DEVICE,
  SLEEP_DEVICE,
  SYNC_GAMES,
  TEST_STEAM_INTEGRATION,
  TOGGLE_QUICK_ACCESS_GAME,
  UNINSTALL_GAME,
  UPDATE_COLLECTION,
  WINDOW_CLOSE,
  WINDOW_MAXIMIZE,
  WINDOW_MINIMIZE,
} from "../preload/channels";
import { createCollection, deleteCollection, getCollections, updateCollection } from "./channels/collections";
import { GameSyncManager } from "./channels/game-sync-manager";
import {
  getCollectionGamesHandler,
  getFilteredGamesHandler,
  getGameById,
  getGameFilters,
  getGamesLastSyncedAt,
  getGamesListHandler,
  getNewGamesHandler,
  getProtondbTier,
  getQuickLaunchGamesHandler,
  installGameHandler,
  launchGameHandler,
  removeGame,
  toggleQuickLaunchGameHandler,
  uninstallGameHandler,
} from "./channels/games";
import { getLocale } from "./channels/get-locale";
import { authenticateIntegration } from "./channels/integrations";
import { getOS } from "./channels/os";
import { restartApp, restartDevice, shutdownDevice, sleepDevice } from "./channels/power";
import { decrypt, encrypt } from "./channels/safe-storage";
import { closeWindow, minimizeWindow, toggleWindowMaximized } from "./window";

const conf = new Conf();

conf.registerRendererListener();

function createWindow() {
  // Create the browser window.
  const browserWindow = new BrowserWindow({
    autoHideMenuBar: true,
    backgroundColor: "#00000000",
    center: true,
    closable: true,
    enableLargerThanScreen: false,
    focusable: true,
    frame: false,
    fullscreenable: true,
    hasShadow: true,
    height: 800,
    maximizable: true,
    minHeight: 800,
    minWidth: 1280,
    minimizable: true,
    movable: true,
    resizable: true,
    roundedCorners: true,
    show: false,
    title: "Trulaunch",
    titleBarOverlay: false,
    titleBarStyle: "hidden",
    transparent: true,
    vibrancy: "under-window",
    visualEffectState: "active",
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
    width: 1280,
  });

  if (process.platform === "darwin") {
    browserWindow.setWindowButtonVisibility(false);
  }

  const syncManager = new GameSyncManager(browserWindow.webContents, conf);

  browserWindow.on("ready-to-show", async () => {
    browserWindow.show();
    const shouldAutoSync = conf.get("library_settings.state.syncOnStartup");

    if (shouldAutoSync) {
      syncManager.sync([Library.Steam]);
    }
  });

  browserWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    browserWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    browserWindow.loadFile(join(__dirname, "../renderer/index.html"));
  }

  return { browserWindow, syncManager };
}

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

  const { browserWindow, syncManager } = createWindow();

  ipcMain.handle(AUTHENTICATE_INTEGRATION, authenticateIntegration(browserWindow));
  ipcMain.handle(DECRYPT, decrypt);
  ipcMain.handle(ENCRYPT, encrypt);
  ipcMain.handle(CREATE_COLLECTION, createCollection(browserWindow.webContents));
  ipcMain.handle(GET_COLLECTIONS, getCollections);
  ipcMain.handle(UPDATE_COLLECTION, updateCollection(browserWindow.webContents));
  ipcMain.handle(DELETE_COLLECTION, deleteCollection(browserWindow.webContents));
  ipcMain.handle(GET_GAME_FILTERS, getGameFilters);
  ipcMain.handle(GET_GAME_BY_ID, getGameById);
  ipcMain.handle(GET_GAMES_LAST_SYNCED_AT, getGamesLastSyncedAt);
  ipcMain.handle(GET_LOCALE, getLocale);
  ipcMain.handle(GET_PROTONDB_TIER, getProtondbTier);
  ipcMain.handle(GET_OS, getOS);
  ipcMain.handle(REMOVE_GAME, removeGame(browserWindow.webContents));
  ipcMain.handle(TEST_STEAM_INTEGRATION, () => syncManager.isIntegrationValid(Library.Steam));
  ipcMain.on(CLEAR_SYNC_QUEUE, () => syncManager.clear());
  ipcMain.on(RESTART_APP, restartApp);
  ipcMain.on(RESTART_DEVICE, restartDevice);
  ipcMain.on(SHUTDOWN_DEVICE, shutdownDevice);
  ipcMain.on(SLEEP_DEVICE, sleepDevice);
  ipcMain.on(SYNC_GAMES, () => syncManager.sync([Library.EpicGameStore, Library.Steam]));
  ipcMain.on(WINDOW_MINIMIZE, () => minimizeWindow(browserWindow));
  ipcMain.on(WINDOW_MAXIMIZE, () => toggleWindowMaximized(browserWindow));
  ipcMain.on(WINDOW_CLOSE, () => closeWindow(browserWindow));

  ipcMain.handle(GET_GAMES_LIST, getGamesListHandler);
  ipcMain.handle(GET_FILTERED_GAMES, getFilteredGamesHandler);
  ipcMain.handle(GET_NEW_GAMES, getNewGamesHandler);
  ipcMain.handle(GET_COLLECTION_GAMES, getCollectionGamesHandler);
  ipcMain.handle(GET_QUICK_ACCESS_GAMES, getQuickLaunchGamesHandler);
  ipcMain.handle(TOGGLE_QUICK_ACCESS_GAME, toggleQuickLaunchGameHandler(browserWindow.webContents));
  ipcMain.on(LAUNCH_GAME, (_, id: string) => launchGameHandler(id));
  ipcMain.on(INSTALL_GAME, (_, id: string) => installGameHandler(id));
  ipcMain.on(UNINSTALL_GAME, (_, id: string) => uninstallGameHandler(id));

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
