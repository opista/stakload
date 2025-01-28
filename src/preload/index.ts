import { CollectionStoreModel } from "@contracts/database/collections";
import { GameFilters, LikeLibrary } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { exposeConf } from "electron-conf/preload";

import {
  AUTHENTICATE_INTEGRATION,
  CREATE_COLLECTION,
  DECRYPT,
  DELETE_COLLECTION,
  ENCRYPT,
  EPIC_GAMES_INTEGRATION_RESULT,
  EVENT_COLLECTIONS_LIST_UPDATED,
  EVENT_GAME_SYNC_STATUS,
  EVENT_GAMES_LIST_UPDATED,
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
} from "./channels";
import { listenerHandler } from "./util/listener-handler";

// Custom APIs for renderer
const api = {
  authenticateIntegration: (library: LikeLibrary) => ipcRenderer.invoke(AUTHENTICATE_INTEGRATION, library),
  closeWindow: () => ipcRenderer.send(WINDOW_CLOSE),
  createCollection: (collection: Pick<CollectionStoreModel, "name" | "filters">) =>
    ipcRenderer.invoke(CREATE_COLLECTION, collection),
  decrypt: (str: string) => ipcRenderer.invoke(DECRYPT, str),
  deleteCollection: (id: string) => ipcRenderer.invoke(DELETE_COLLECTION, id),
  encrypt: (str: string) => ipcRenderer.invoke(ENCRYPT, str),
  getCollectionGames: (id: string) => ipcRenderer.invoke(GET_COLLECTION_GAMES, id),
  getCollections: () => ipcRenderer.invoke(GET_COLLECTIONS),
  getFilteredGames: (filters: GameFilters) => ipcRenderer.invoke(GET_FILTERED_GAMES, filters),
  getGameById: (id: string) => ipcRenderer.invoke(GET_GAME_BY_ID, id),
  getGameFilters: () => ipcRenderer.invoke(GET_GAME_FILTERS),
  getGamesLastSyncedAt: () => ipcRenderer.invoke(GET_GAMES_LAST_SYNCED_AT),
  getGamesList: () => ipcRenderer.invoke(GET_GAMES_LIST),
  getLocale: (): Promise<string> => ipcRenderer.invoke(GET_LOCALE),
  getNewGames: () => ipcRenderer.invoke(GET_NEW_GAMES),
  getOS: (): Promise<string> => ipcRenderer.invoke(GET_OS),
  getProtondbTier: (gameId: string) => ipcRenderer.invoke(GET_PROTONDB_TIER, gameId),
  getQuickLaunchGames: () => ipcRenderer.invoke(GET_QUICK_ACCESS_GAMES),
  installGame: (id: string) => ipcRenderer.send(INSTALL_GAME, id),
  launchGame: (id: string) => ipcRenderer.send(LAUNCH_GAME, id),
  maximizeWindow: () => ipcRenderer.send(WINDOW_MAXIMIZE),
  minimizeWindow: () => ipcRenderer.send(WINDOW_MINIMIZE),
  onCollectionsUpdated: (listener: (event) => void) => listenerHandler(EVENT_COLLECTIONS_LIST_UPDATED, listener),
  onEpicGamesAuthentication: (listener: (event, data: unknown) => void) =>
    listenerHandler(EPIC_GAMES_INTEGRATION_RESULT, listener),
  onGamesListUpdated: (listener: (event) => void) => listenerHandler(EVENT_GAMES_LIST_UPDATED, listener),
  onSyncGameStatus: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_GAME_SYNC_STATUS, listener),
  removeGame: (id: string, preventReadd: boolean) => ipcRenderer.invoke(REMOVE_GAME, id, preventReadd),
  restartApp: (): void => ipcRenderer.send(RESTART_APP),
  restartDevice: (): void => ipcRenderer.send(RESTART_DEVICE),
  shutdownDevice: (): void => ipcRenderer.send(SHUTDOWN_DEVICE),
  sleepDevice: (): void => ipcRenderer.send(SLEEP_DEVICE),
  syncGames: () => ipcRenderer.send(SYNC_GAMES),
  testLibraryIntegration: (steamId: string, webApiKey: string) =>
    ipcRenderer.invoke(TEST_STEAM_INTEGRATION, steamId, webApiKey),
  toggleQuickLaunchGame: (id: string) => ipcRenderer.invoke(TOGGLE_QUICK_ACCESS_GAME, id),
  uninstallGame: (id: string) => ipcRenderer.send(UNINSTALL_GAME, id),
  updateCollection: (id: string, updates: Pick<CollectionStoreModel, "icon" | "name" | "filters">) =>
    ipcRenderer.invoke(UPDATE_COLLECTION, id, updates),
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
