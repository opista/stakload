import { is } from "@electron-toolkit/utils";
import { app, BrowserWindow, shell } from "electron";
import { join } from "path";
import { Service } from "typedi";

@Service()
export class WindowService {
  private browserWindow: BrowserWindow | null = null;

  constructor() {
    app.on("activate", () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createWindow();
      }
    });
  }

  getBrowserWindow(): BrowserWindow {
    if (!this.browserWindow) {
      throw new Error("Browser window has not been initialized");
    }
    return this.browserWindow;
  }

  createWindow(): BrowserWindow {
    this.browserWindow = new BrowserWindow({
      autoHideMenuBar: true,
      backgroundColor: "#00000000",
      center: true,
      closable: true,
      enableLargerThanScreen: false,
      focusable: true,
      frame: process.platform !== "win32",
      fullscreenable: true,
      hasShadow: true,
      height: 800,
      maximizable: true,
      minHeight: 800,
      minWidth: 800,
      minimizable: true,
      movable: true,
      resizable: true,
      roundedCorners: true,
      show: false,
      title: "Trulaunch",
      titleBarOverlay: false,
      titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "hidden",
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

    this.browserWindow.on("ready-to-show", () => {
      this.browserWindow?.show();
    });

    this.browserWindow.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url);
      return { action: "deny" };
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      this.browserWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
      this.browserWindow.loadFile(join(__dirname, "../../renderer/index.html"));
    }

    return this.browserWindow;
  }

  minimize() {
    this.browserWindow?.minimize();
  }

  maximize() {
    this.browserWindow?.maximize();
  }

  close() {
    this.browserWindow?.close();
  }

  toggleMaximized() {
    this.browserWindow?.isMaximized() ? this.restore() : this.maximize();
  }

  restore() {
    this.browserWindow?.restore();
  }

  focus() {
    this.browserWindow?.focus();
  }

  sendEvent(channel: string, ...args: unknown[]) {
    return this.browserWindow?.webContents.send(channel, ...args);
  }
}
