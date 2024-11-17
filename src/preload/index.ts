import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import { FETCH, GET_BATTERY_INFO, GET_LOCALE, OPEN_WEBPAGE } from "./channels";
import { BatteryInfo } from "../main/channels/get-battery-info";

// Custom APIs for renderer
const api = {
  getBatteryInfo: (): Promise<BatteryInfo> => ipcRenderer.invoke(GET_BATTERY_INFO),
  getLocale: (): Promise<string> => ipcRenderer.invoke(GET_LOCALE),
  fetch: <T>(...args: Parameters<typeof fetch>): Promise<T> => ipcRenderer.invoke(FETCH, ...args),
  openWebpage: (url: string): void => ipcRenderer.send(OPEN_WEBPAGE, url),
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
