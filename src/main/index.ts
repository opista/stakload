import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import {
  CLOSE_APP,
  DECRYPT,
  ENCRYPT,
  FETCH,
  GET_FILTERED_GAMES,
  GET_GAME_BY_ID,
  GET_GAMES_LAST_SYNCED_AT,
  GET_LOCALE,
  GET_OS,
  OPEN_WEBPAGE,
  REMOVE_GAME,
  RESTART_APP,
  RESTART_DEVICE,
  SHUTDOWN_DEVICE,
  SLEEP_DEVICE,
  SYNC_GAMES,
  TEST_STEAM_INTEGRATION,
} from "../preload/channels";
import { nodeFetch } from "./channels/fetch";
import { openWebpage } from "./channels/open-webpage";
import { getLocale } from "./channels/get-locale";
import { closeApp, sleepDevice, restartApp, restartDevice, shutdownDevice } from "./channels/power";
import { Conf } from "electron-conf/main";
import { getFilteredGameLibrary, getGameById, getGamesLastSyncedAt, removeGame } from "./channels/games";
import { GameSyncManager } from "./channels/game-sync-manager";
import { getOS } from "./channels/os";
import { decrypt, encrypt } from "./channels/safe-storage";
import { testSteamIntegration } from "./channels/integrations";

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

    /**
     * TODO - Trigger sync on startup. Later
     * we should add configuration for the user
     * to manually sync too/instead. SYNC_GAMES
     * does this, but we should allow disabling
     * of auto-sync
     */
    // await syncManager.syncGames();
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

  // getOwnedGames("47D232D3BB9240F67610B1609383FB82", "76561198021450658").then(({ games }) => {
  //   const mapped = games.map((game) => mapOwnedGameDetailsToGameStoreModel(game, "steam"));

  //   return bulkInsertGames(mapped);
  // });
  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const { browserWindow, syncManager } = createWindow();

  ipcMain.handle(DECRYPT, decrypt);
  ipcMain.handle(ENCRYPT, encrypt);
  ipcMain.handle(GET_LOCALE, getLocale);
  ipcMain.handle(GET_OS, getOS);
  ipcMain.handle(FETCH, nodeFetch);
  ipcMain.handle(TEST_STEAM_INTEGRATION, testSteamIntegration);
  ipcMain.handle(GET_FILTERED_GAMES, getFilteredGameLibrary);
  ipcMain.handle(GET_GAME_BY_ID, getGameById);
  ipcMain.handle(GET_GAMES_LAST_SYNCED_AT, getGamesLastSyncedAt);
  ipcMain.handle(REMOVE_GAME, removeGame(browserWindow.webContents));
  ipcMain.on(SYNC_GAMES, () => syncManager.sync());
  ipcMain.on(OPEN_WEBPAGE, openWebpage);
  ipcMain.on(CLOSE_APP, closeApp);
  ipcMain.on(RESTART_APP, restartApp);
  ipcMain.on(RESTART_DEVICE, restartDevice);
  ipcMain.on(SHUTDOWN_DEVICE, shutdownDevice);
  ipcMain.on(SLEEP_DEVICE, sleepDevice);

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
