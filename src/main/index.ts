import { Library } from "@contracts/database/games";
import { electronApp, is, optimizer } from "@electron-toolkit/utils";
import { app, BrowserWindow, ipcMain, shell } from "electron";
import { Conf } from "electron-conf/main";
import installExtension, { REACT_DEVELOPER_TOOLS } from "electron-devtools-installer";
import { join } from "path";

import {
  COLLECTION_CHANNELS,
  GAME_CHANNELS,
  INTEGRATION_CHANNELS,
  QUICK_ACCESS_CHANNELS,
  SECURITY_CHANNELS,
  SYSTEM_CHANNELS,
  WINDOW_CHANNELS,
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
  toggleFavouriteGameHandler,
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

  // Integration Handlers
  ipcMain.handle(INTEGRATION_CHANNELS.AUTHENTICATE, authenticateIntegration(browserWindow));
  ipcMain.handle(INTEGRATION_CHANNELS.TEST_STEAM, () => syncManager.isIntegrationValid(Library.Steam));

  // Security Handlers
  ipcMain.handle(SECURITY_CHANNELS.DECRYPT, decrypt);
  ipcMain.handle(SECURITY_CHANNELS.ENCRYPT, encrypt);

  // Collection Handlers
  ipcMain.handle(COLLECTION_CHANNELS.CREATE, createCollection(browserWindow.webContents));
  ipcMain.handle(COLLECTION_CHANNELS.GET_ALL, getCollections);
  ipcMain.handle(COLLECTION_CHANNELS.UPDATE, updateCollection(browserWindow.webContents));
  ipcMain.handle(COLLECTION_CHANNELS.DELETE, deleteCollection(browserWindow.webContents));

  // Game Management Handlers
  ipcMain.handle(GAME_CHANNELS.GET_FILTERS, getGameFilters);
  ipcMain.handle(GAME_CHANNELS.GET_BY_ID, getGameById);
  ipcMain.handle(GAME_CHANNELS.GET_LAST_SYNCED, getGamesLastSyncedAt);
  ipcMain.handle(GAME_CHANNELS.GET_PROTONDB_TIER, getProtondbTier);
  ipcMain.handle(GAME_CHANNELS.REMOVE, removeGame(browserWindow.webContents));
  ipcMain.handle(GAME_CHANNELS.GET_LIST, getGamesListHandler);
  ipcMain.handle(GAME_CHANNELS.GET_FILTERED, getFilteredGamesHandler);
  ipcMain.handle(GAME_CHANNELS.GET_NEW, getNewGamesHandler);
  ipcMain.handle(GAME_CHANNELS.TOGGLE_FAVOURITE, toggleFavouriteGameHandler(browserWindow.webContents));
  ipcMain.on(GAME_CHANNELS.SYNC, () => syncManager.sync([Library.EpicGameStore, Library.Steam]));
  ipcMain.on(GAME_CHANNELS.LAUNCH, (_, id: string) => launchGameHandler(id, browserWindow));
  ipcMain.on(GAME_CHANNELS.INSTALL, (_, id: string) => installGameHandler(id));
  ipcMain.on(GAME_CHANNELS.UNINSTALL, (_, id: string) => uninstallGameHandler(id));

  // Quick Access Handlers
  ipcMain.handle(COLLECTION_CHANNELS.GET_GAMES, getCollectionGamesHandler);
  ipcMain.handle(QUICK_ACCESS_CHANNELS.GET_GAMES, getQuickLaunchGamesHandler);
  ipcMain.handle(QUICK_ACCESS_CHANNELS.TOGGLE_GAME, toggleQuickLaunchGameHandler(browserWindow.webContents));

  // System Handlers
  ipcMain.handle(SYSTEM_CHANNELS.GET_LOCALE, getLocale);
  ipcMain.handle(SYSTEM_CHANNELS.GET_OS, getOS);
  ipcMain.on(SYSTEM_CHANNELS.RESTART_APP, restartApp);
  ipcMain.on(SYSTEM_CHANNELS.RESTART_DEVICE, restartDevice);
  ipcMain.on(SYSTEM_CHANNELS.SHUTDOWN_DEVICE, shutdownDevice);
  ipcMain.on(SYSTEM_CHANNELS.SLEEP_DEVICE, sleepDevice);

  // Window Management Handlers
  ipcMain.on(WINDOW_CHANNELS.MINIMIZE, () => minimizeWindow(browserWindow));
  ipcMain.on(WINDOW_CHANNELS.MAXIMIZE, () => toggleWindowMaximized(browserWindow));
  ipcMain.on(WINDOW_CHANNELS.CLOSE, () => closeWindow(browserWindow));

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
