import { app, shell, BrowserWindow, ipcMain } from "electron";
import { join } from "path";
import { electronApp, optimizer, is } from "@electron-toolkit/utils";
import {
  CLOSE_APP,
  FETCH,
  GET_LOCALE,
  OPEN_WEBPAGE,
  RESTART_APP,
  RESTART_DEVICE,
  SHUTDOWN_DEVICE,
  SLEEP_DEVICE,
  SYNC_GAMES,
} from "../preload/channels";
import { nodeFetch } from "./channels/fetch";
import { openWebpage } from "./channels/open-webpage";
import { getLocale } from "./channels/get-locale";
import { closeApp, sleepDevice, restartApp, restartDevice, shutdownDevice } from "./channels/power";
import { syncManager } from "./channels/sync-manager";
import { Conf } from "electron-conf/main";

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
    minHeight: 400,
    minWidth: 450,
    movable: true,
    resizable: true,
    roundedCorners: true,
    show: true,
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
      nodeIntegrationInWorker: true,
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

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
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

  return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId("com.electron");

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on("browser-window-created", (_, window) => {
    optimizer.watchWindowShortcuts(window);
  });

  const browserWindow = createWindow();

  ipcMain.handle(GET_LOCALE, getLocale);
  ipcMain.handle(FETCH, nodeFetch);
  ipcMain.on(SYNC_GAMES, syncManager(browserWindow.webContents));
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
