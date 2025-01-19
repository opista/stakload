import { CollectionStoreModel } from "@contracts/database/collections";
import { LikeLibrary } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/store/game";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { exposeConf } from "electron-conf/preload";

import {
  AUTHENTICATE_INTEGRATION,
  CLEAR_SYNC_QUEUE,
  CREATE_COLLECTION,
  DECRYPT,
  DELETE_COLLECTION,
  ENCRYPT,
  EPIC_GAMES_INTEGRATION_RESULT,
  EVENT_COLLECTIONS_LIST_UPDATED,
  EVENT_GAMES_LIST_UPDATED,
  EVENT_METADATA_SYNC_COMPLETE,
  EVENT_METADATA_SYNC_INSERTED,
  EVENT_METADATA_SYNC_PROCESSED,
  EVENT_METADATA_SYNC_SKIPPED,
  EVENT_SYNC_QUEUE_CLEARED,
  GET_COLLECTION_GAMES,
  GET_COLLECTIONS,
  GET_GAME_BY_ID,
  GET_GAME_FILTERS,
  GET_GAMES_LAST_SYNCED_AT,
  GET_GAMES_LIST,
  GET_LOCALE,
  GET_NEW_GAMES,
  GET_OS,
  GET_PROTONDB_TIER,
  REMOVE_GAME,
  RESTART_APP,
  RESTART_DEVICE,
  SHUTDOWN_DEVICE,
  SLEEP_DEVICE,
  SYNC_GAMES,
  TEST_STEAM_INTEGRATION,
  WINDOW_CLOSE,
  WINDOW_MAXIMIZE,
  WINDOW_MINIMIZE,
} from "./channels";
import { listenerHandler } from "./util/listener-handler";

// Custom APIs for renderer
const api = {
  authenticateIntegration: (library: LikeLibrary) => ipcRenderer.invoke(AUTHENTICATE_INTEGRATION, library),
  clearSyncQueue: () => ipcRenderer.send(CLEAR_SYNC_QUEUE),
  closeWindow: () => ipcRenderer.send(WINDOW_CLOSE),
  createCollection: (collection: Pick<CollectionStoreModel, "name" | "filters">) =>
    ipcRenderer.invoke(CREATE_COLLECTION, collection),
  decrypt: (str: string) => ipcRenderer.invoke(DECRYPT, str),
  deleteCollection: (id: string) => ipcRenderer.invoke(DELETE_COLLECTION, id),
  encrypt: (str: string) => ipcRenderer.invoke(ENCRYPT, str),
  getCollectionGames: (id: string) => ipcRenderer.invoke(GET_COLLECTION_GAMES, id),
  getCollections: () => ipcRenderer.invoke(GET_COLLECTIONS),
  getGameById: (id: string) => ipcRenderer.invoke(GET_GAME_BY_ID, id),
  getGameFilters: () => ipcRenderer.invoke(GET_GAME_FILTERS),
  getGamesLastSyncedAt: () => ipcRenderer.invoke(GET_GAMES_LAST_SYNCED_AT),
  getGamesList: () => ipcRenderer.invoke(GET_GAMES_LIST),
  getLocale: (): Promise<string> => ipcRenderer.invoke(GET_LOCALE),
  getNewGames: () => ipcRenderer.invoke(GET_NEW_GAMES),
  getOS: (): Promise<string> => ipcRenderer.invoke(GET_OS),
  getProtondbTier: (gameId: string) => ipcRenderer.invoke(GET_PROTONDB_TIER, gameId),
  maximizeWindow: () => ipcRenderer.send(WINDOW_MAXIMIZE),
  minimizeWindow: () => ipcRenderer.send(WINDOW_MINIMIZE),
  onCollectionsUpdated: (listener: (event) => void) => listenerHandler(EVENT_COLLECTIONS_LIST_UPDATED, listener),
  onEpicGamesAuthentication: (listener: (event, data: unknown) => void) =>
    listenerHandler(EPIC_GAMES_INTEGRATION_RESULT, listener),
  onGamesListUpdated: (listener: (event) => void) => listenerHandler(EVENT_GAMES_LIST_UPDATED, listener),
  onSyncComplete: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_COMPLETE, listener),
  onSyncInserted: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_INSERTED, listener),
  onSyncProcessed: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_PROCESSED, listener),
  onSyncQueueCleared: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_SYNC_QUEUE_CLEARED, listener),
  onSyncSkipped: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_SKIPPED, listener),
  removeGame: (id: string, preventReadd: boolean) => ipcRenderer.invoke(REMOVE_GAME, id, preventReadd),
  restartApp: (): void => ipcRenderer.send(RESTART_APP),
  restartDevice: (): void => ipcRenderer.send(RESTART_DEVICE),
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
