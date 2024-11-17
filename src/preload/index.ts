import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { CLOSE_APP, FETCH, GET_LOCALE, SLEEP_DEVICE, OPEN_WEBPAGE, RESTART_APP, SHUTDOWN_DEVICE } from "./channels";

// Custom APIs for renderer
const api = {
  getLocale: (): Promise<string> => ipcRenderer.invoke(GET_LOCALE),
  fetch: <T>(...args: Parameters<typeof fetch>): Promise<T> => ipcRenderer.invoke(FETCH, ...args),
  openWebpage: (url: string): void => ipcRenderer.send(OPEN_WEBPAGE, url),
  closeApp: (): void => ipcRenderer.send(CLOSE_APP),
  restartApp: (): void => ipcRenderer.send(RESTART_APP),
  restartDevice: (): void => ipcRenderer.send(RESTART_APP),
  shutdownDevice: (): void => ipcRenderer.send(SHUTDOWN_DEVICE),
  sleepDevice: (): void => ipcRenderer.send(SLEEP_DEVICE),
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("electron", electronAPI);
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI;
  // @ts-ignore (define in dts)
  window.api = api;
}
