import { BrowserWindow, Rectangle, screen } from "electron";

let previousBounds: Rectangle | null = null;

export const toggleWindowMaximized = (browserWindow: BrowserWindow) => {
  if (!browserWindow) return;

  const bounds = browserWindow.getBounds();
  const isFullScreen = browserWindow.isFullScreen();
  const { workArea } = screen.getPrimaryDisplay();

  const isEffectivelyMaximized = bounds.width >= workArea.width && bounds.height >= workArea.height;

  if (isEffectivelyMaximized || isFullScreen) {
    if (previousBounds) {
      browserWindow.setBounds(previousBounds);
      previousBounds = null;
    }
  } else {
    previousBounds = browserWindow.getBounds();
    browserWindow.maximize();
  }
};

export const minimizeWindow = (browserWindow: BrowserWindow) => {
  if (!browserWindow) return;

  browserWindow.minimize();
};

export const closeWindow = (browserWindow: BrowserWindow) => {
  if (!browserWindow) return;

  browserWindow.close();
};
