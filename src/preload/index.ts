import { contextBridge, ipcRenderer } from "electron";
import { electronAPI } from "@electron-toolkit/preload";
import {
  CLOSE_APP,
  FETCH,
  GET_LOCALE,
  SLEEP_DEVICE,
  OPEN_WEBPAGE,
  RESTART_APP,
  SHUTDOWN_DEVICE,
  SYNC_GAMES,
  EVENT_METADATA_SYNC_PROCESSED,
  EVENT_METADATA_SYNC_COMPLETE,
  EVENT_METADATA_SYNC_INSERTED,
  GET_FILTERED_GAMES,
  GET_OS,
  GET_GAME_BY_ID,
  TEST_STEAM_INTEGRATION,
  ENCRYPT,
  DECRYPT,
  GET_GAMES_LAST_SYNCED_AT,
  REMOVE_GAME,
  EVENT_GAMES_LIST_UPDATED,
} from "./channels";
import { exposeConf } from "electron-conf/preload";
import { AppDetails } from "../main/libraries/steam/types/app-details";
import { ListenerHandler } from "../main/util/listener-handler";

const listenerHandler = new ListenerHandler();

// Custom APIs for renderer
const api = {
  closeApp: (): void => ipcRenderer.send(CLOSE_APP),
  decrypt: (str: string) => ipcRenderer.invoke(DECRYPT, str),
  encrypt: (str: string) => ipcRenderer.invoke(ENCRYPT, str),
  fetch: <T>(...args: Parameters<typeof fetch>): Promise<T> => ipcRenderer.invoke(FETCH, ...args),
  getFilteredGames: () => ipcRenderer.invoke(GET_FILTERED_GAMES),
  getGameById: (id: string) => ipcRenderer.invoke(GET_GAME_BY_ID, id),
  getGamesLastSyncedAt: () => ipcRenderer.invoke(GET_GAMES_LAST_SYNCED_AT),
  getLocale: (): Promise<string> => ipcRenderer.invoke(GET_LOCALE),
  getOS: (): Promise<string> => ipcRenderer.invoke(GET_OS),
  offGamesListUpdated: (listenerId: string) => listenerHandler.remove(EVENT_GAMES_LIST_UPDATED, listenerId),
  offSyncComplete: (listenerId: string) => listenerHandler.remove(EVENT_METADATA_SYNC_COMPLETE, listenerId),
  offSyncInserted: (listenerId: string) => listenerHandler.remove(EVENT_METADATA_SYNC_INSERTED, listenerId),
  offSyncProcessed: (listenerId: string) => listenerHandler.remove(EVENT_METADATA_SYNC_PROCESSED, listenerId),
  onGamesListUpdated: (listener: (event) => void) => listenerHandler.add(EVENT_GAMES_LIST_UPDATED, listener),
  onSyncComplete: (listener: (event) => void) => listenerHandler.add(EVENT_METADATA_SYNC_COMPLETE, listener),
  onSyncInserted: (listener: (event, count) => void) => listenerHandler.add(EVENT_METADATA_SYNC_INSERTED, listener),
  onSyncProcessed: (listener: (event, args: { id: string; appDetails: AppDetails }) => void) =>
    listenerHandler.add(EVENT_METADATA_SYNC_PROCESSED, listener),
  openWebpage: (url: string): void => ipcRenderer.send(OPEN_WEBPAGE, url),
  removeGame: (id: string, preventReadd: boolean) => ipcRenderer.invoke(REMOVE_GAME, id, preventReadd),
  restartApp: (): void => ipcRenderer.send(RESTART_APP),
  restartDevice: (): void => ipcRenderer.send(RESTART_APP),
  shutdownDevice: (): void => ipcRenderer.send(SHUTDOWN_DEVICE),
  sleepDevice: (): void => ipcRenderer.send(SLEEP_DEVICE),
  syncGames: () => ipcRenderer.send(SYNC_GAMES),
  testLibraryIntegration: (steamId: string, webApiKey: string) =>
    ipcRenderer.invoke(TEST_STEAM_INTEGRATION, steamId, webApiKey),
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

exposeConf();
