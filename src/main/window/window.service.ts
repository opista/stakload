import { is, platform } from "@electron-toolkit/utils";
import { app, BrowserWindow, session, shell } from "electron";
import { join } from "path";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";
import { ChildWindowOptions } from "./types";

@Service()
export class WindowService {
  private browserWindow: BrowserWindow | null = null;

  constructor(private readonly logger: LoggerService) {
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.logger.info("App activated on macOS with no windows; creating new main window");
        this.createWindow();
      }
    });
  }

  getBrowserWindow(): BrowserWindow {
    if (!this.browserWindow) {
      const error = new Error("Browser window has not been initialized");
      this.logger.error("Attempted to retrieve an uninitialised browser window", { error });
      throw error;
    }
    return this.browserWindow;
  }

  createWindow(): BrowserWindow {
    this.logger.info("Creating main browser window");
    this.browserWindow = new BrowserWindow({
      autoHideMenuBar: true,
      backgroundColor: "#00000000",
      center: true,
      closable: true,
      enableLargerThanScreen: false,
      focusable: true,
      frame: platform.isWindows,
      fullscreenable: true,
      hasShadow: true,
      height: 800,
      maximizable: true,
      minHeight: 800,
      minWidth: 1200,
      minimizable: true,
      movable: true,
      resizable: true,
      roundedCorners: true,
      show: false,
      title: "Stakload",
      titleBarOverlay: false,
      titleBarStyle: platform.isMacOS ? "hiddenInset" : "hidden",
      vibrancy: "under-window",
      visualEffectState: "active",
      webPreferences: {
        accessibleTitle: "Stakload",
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
      this.logger.debug("Main browser window ready to show");
      this.browserWindow?.show();
    });

    this.browserWindow.webContents.setWindowOpenHandler((details) => {
      this.logger.debug("Request to open external URL", { url: details.url });
      shell.openExternal(details.url);
      return { action: "deny" };
    });

    if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
      this.logger.debug("Loading renderer URL from environment", {
        url: process.env["ELECTRON_RENDERER_URL"],
      });
      this.browserWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
    } else {
      const filePath = join(__dirname, "../../renderer/index.html");
      this.logger.debug("Loading renderer file", { filePath });
      this.browserWindow.loadFile(filePath);
    }

    return this.browserWindow;
  }

  minimize() {
    this.logger.debug("Minimising main window");
    this.browserWindow?.minimize();
  }

  maximize() {
    this.logger.debug("Maximising main window");
    this.browserWindow?.maximize();
  }

  close() {
    this.logger.debug("Closing main window");
    this.browserWindow?.close();
  }

  toggleMaximized() {
    if (this.browserWindow?.isMaximized()) {
      this.logger.debug("Restoring main window from maximised state");
      this.restore();
    } else {
      this.logger.debug("Maximising main window via toggle");
      this.maximize();
    }
  }

  restore() {
    this.logger.debug("Restoring main window");
    this.browserWindow?.restore();
  }

  focus() {
    this.logger.debug("Focusing main window");
    this.browserWindow?.focus();
  }

  sendEvent(channel: string, ...args: unknown[]) {
    this.logger.debug("Sending event to renderer", { args, channel });
    return this.browserWindow?.webContents.send(channel, ...args);
  }

  async createChildWindow({
    clearCookies = true,
    height,
    networkRequestHandler,
    sessionId,
    url,
    width,
  }: ChildWindowOptions) {
    try {
      this.logger.debug("Creating child window", { height, sessionId, url, width });
      const integrationSession = session.fromPartition(sessionId);
      if (clearCookies) {
        await integrationSession.clearStorageData({ storages: ["cookies"] });
      }

      const integrationWindow = new BrowserWindow({
        alwaysOnTop: true,
        autoHideMenuBar: true,
        center: true,
        closable: true,
        fullscreen: false,
        fullscreenable: false,
        height,
        modal: false,
        movable: true,
        parent: this.getBrowserWindow(),
        resizable: false,
        show: false,
        webPreferences: {
          contextIsolation: true,
          nodeIntegration: false,
          session: integrationSession,
        },
        width,
      });

      integrationWindow.webContents.on("did-navigate", (...args) => {
        this.logger.debug("Child window navigated", { url: args[1] });
        networkRequestHandler?.(integrationWindow, ...args);
      });
      await integrationWindow.loadURL(url);

      this.logger.info("Child window created", { url });

      return integrationWindow;
    } catch (error: unknown) {
      this.logger.error("Error creating child window", { error, sessionId, url });
      throw error;
    }
  }
}
