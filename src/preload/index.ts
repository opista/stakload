import { CollectionStoreModel } from "@contracts/database/collections";
import { GameFilters, LikeLibrary } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { exposeConf } from "electron-conf/preload";

import { COLLECTION_CHANNELS } from "../main/collection/collection.channels";
import { GAME_CHANNELS } from "../main/game/game.channels";
import { SYNC_CHANNELS } from "../main/sync/sync.channels";
import { SYSTEM_CHANNELS } from "../main/system/system.channels";
import { WINDOW_CHANNELS } from "../main/window/window.channels";
import { EVENT_CHANNELS, INTEGRATION_CHANNELS, SECURITY_CHANNELS } from "./channels";
import { listenerHandler } from "./util/listener-handler";

// Custom APIs for renderer
const api = {
  // System Operations
  getLocale: (): Promise<string> => ipcRenderer.invoke(SYSTEM_CHANNELS.GET_LOCALE),
  restartApp: (): void => ipcRenderer.send(SYSTEM_CHANNELS.RESTART_APP),
  restartDevice: (): void => ipcRenderer.send(SYSTEM_CHANNELS.RESTART_DEVICE),
  shutdownDevice: (): void => ipcRenderer.send(SYSTEM_CHANNELS.SHUTDOWN_DEVICE),
  sleepDevice: (): void => ipcRenderer.send(SYSTEM_CHANNELS.SLEEP_DEVICE),

  // Window Management
  closeWindow: () => ipcRenderer.send(WINDOW_CHANNELS.CLOSE),
  maximizeWindow: () => ipcRenderer.send(WINDOW_CHANNELS.MAXIMIZE),
  minimizeWindow: () => ipcRenderer.send(WINDOW_CHANNELS.MINIMIZE),

  // Collection Management
  createCollection: (collection: Pick<CollectionStoreModel, "name" | "filters">) =>
    ipcRenderer.invoke(COLLECTION_CHANNELS.CREATE, collection),
  deleteCollection: (id: string) => ipcRenderer.invoke(COLLECTION_CHANNELS.DELETE, id),
  getCollectionGames: (id: string) => ipcRenderer.invoke(GAME_CHANNELS.GET_BY_COLLECTION, id),
  getCollections: () => ipcRenderer.invoke(COLLECTION_CHANNELS.GET_ALL),
  updateCollection: (id: string, updates: Pick<CollectionStoreModel, "icon" | "name" | "filters">) =>
    ipcRenderer.invoke(COLLECTION_CHANNELS.UPDATE, id, updates),

  // Game Management
  getFilteredGames: (filters: GameFilters) => ipcRenderer.invoke(GAME_CHANNELS.GET_FILTERED, filters),
  getGameById: (id: string) => ipcRenderer.invoke(GAME_CHANNELS.GET_BY_ID, id),
  getGameFilters: () => ipcRenderer.invoke(GAME_CHANNELS.GET_FILTERS),
  getGamesList: () => ipcRenderer.invoke(GAME_CHANNELS.GET_LIST),
  getNewGames: () => ipcRenderer.invoke(GAME_CHANNELS.GET_NEW),
  getProtondbTier: (gameId: string) => ipcRenderer.invoke(GAME_CHANNELS.GET_PROTONDB_TIER, gameId),
  getQuickLaunchGames: () => ipcRenderer.invoke(GAME_CHANNELS.GET_QUICK_LAUNCH),
  installGame: (id: string) => ipcRenderer.send(GAME_CHANNELS.INSTALL, id),
  launchGame: (id: string) => ipcRenderer.send(GAME_CHANNELS.LAUNCH, id),
  removeGame: (id: string, preventReadd: boolean) => ipcRenderer.invoke(GAME_CHANNELS.REMOVE, id, preventReadd),
  syncGames: () => ipcRenderer.send(SYNC_CHANNELS.SYNC),
  toggleFavouriteGame: (id: string) => ipcRenderer.invoke(GAME_CHANNELS.TOGGLE_FAVOURITE, id),
  toggleQuickLaunchGame: (id: string) => ipcRenderer.invoke(GAME_CHANNELS.TOGGLE_QUICK_LAUNCH, id),
  uninstallGame: (id: string) => ipcRenderer.send(GAME_CHANNELS.UNINSTALL, id),

  // Integration Management
  authenticateIntegration: (library: LikeLibrary) => ipcRenderer.invoke(INTEGRATION_CHANNELS.AUTHENTICATE, library),
  testLibraryIntegration: (library: LikeLibrary) => ipcRenderer.invoke(SYNC_CHANNELS.TEST_INTEGRATION, library),

  // Security
  decrypt: (str: string) => ipcRenderer.invoke(SECURITY_CHANNELS.DECRYPT, str),
  encrypt: (str: string) => ipcRenderer.invoke(SECURITY_CHANNELS.ENCRYPT, str),

  // Event Listeners
  onCollectionsUpdated: (listener: (event) => void) => listenerHandler(EVENT_CHANNELS.COLLECTIONS_UPDATED, listener),
  onEpicGamesAuthentication: (listener: (event, data: unknown) => void) =>
    listenerHandler(INTEGRATION_CHANNELS.EPIC_GAMES_RESULT, listener),
  onGamesListUpdated: (listener: (event) => void) => listenerHandler(EVENT_CHANNELS.GAMES_LIST_UPDATED, listener),
  onSyncGameStatus: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_CHANNELS.GAME_SYNC_STATUS, listener),
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
