import { CollectionStoreModel } from "@contracts/database/collections";
import { GameFilters, LikeLibrary } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/store/game";
import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { exposeConf } from "electron-conf/preload";

import {
  AUTHENTICATE_INTEGRATION,
  CLEAR_SYNC_QUEUE,
  CLOSE_APP,
  CREATE_COLLECTION,
  DECRYPT,
  ENCRYPT,
  EPIC_GAMES_INTEGRATION_RESULT,
  EVENT_COLLECTIONS_LIST_UPDATED,
  EVENT_GAMES_LIST_UPDATED,
  EVENT_METADATA_SYNC_COMPLETE,
  EVENT_METADATA_SYNC_INSERTED,
  EVENT_METADATA_SYNC_PROCESSED,
  EVENT_METADATA_SYNC_SKIPPED,
  EVENT_SYNC_QUEUE_CLEARED,
  GET_COLLECTIONS,
  GET_FILTERED_GAMES,
  GET_GAME_BY_ID,
  GET_GAME_FILTERS,
  GET_GAMES_LAST_SYNCED_AT,
  GET_LOCALE,
  GET_OS,
  GET_PROTONDB_TIER,
  REMOVE_GAME,
  RESTART_APP,
  SHUTDOWN_DEVICE,
  SLEEP_DEVICE,
  SYNC_GAMES,
  TEST_STEAM_INTEGRATION,
} from "./channels";
import { listenerHandler } from "./util/listener-handler";

// Custom APIs for renderer
const api = {
  authenticateIntegration: (library: LikeLibrary) => ipcRenderer.invoke(AUTHENTICATE_INTEGRATION, library),
  clearSyncQueue: () => ipcRenderer.send(CLEAR_SYNC_QUEUE),
  closeApp: (): void => ipcRenderer.send(CLOSE_APP),
  decrypt: (str: string) => ipcRenderer.invoke(DECRYPT, str),
  encrypt: (str: string) => ipcRenderer.invoke(ENCRYPT, str),
  createCollection: (collection: Pick<CollectionStoreModel, "name" | "filters">) =>
    ipcRenderer.invoke(CREATE_COLLECTION, collection),
  getCollections: () => ipcRenderer.invoke(GET_COLLECTIONS),
  getFilteredGames: (filters?: GameFilters) => ipcRenderer.invoke(GET_FILTERED_GAMES, filters),
  getGameFilters: () => ipcRenderer.invoke(GET_GAME_FILTERS),
  getGameById: (id: string) => ipcRenderer.invoke(GET_GAME_BY_ID, id),
  getGamesLastSyncedAt: () => ipcRenderer.invoke(GET_GAMES_LAST_SYNCED_AT),
  getProtondbTier: (gameId: string) => ipcRenderer.invoke(GET_PROTONDB_TIER, gameId),
  getLocale: (): Promise<string> => ipcRenderer.invoke(GET_LOCALE),
  getOS: (): Promise<string> => ipcRenderer.invoke(GET_OS),
  onGamesListUpdated: (listener: (event) => void) => listenerHandler(EVENT_GAMES_LIST_UPDATED, listener),
  onSyncComplete: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_COMPLETE, listener),
  onSyncInserted: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_INSERTED, listener),
  onSyncProcessed: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_PROCESSED, listener),
  onSyncSkipped: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_METADATA_SYNC_SKIPPED, listener),
  onSyncQueueCleared: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_SYNC_QUEUE_CLEARED, listener),
  onCollectionsUpdated: (listener: (event) => void) => listenerHandler(EVENT_COLLECTIONS_LIST_UPDATED, listener),
  onEpicGamesAuthentication: (listener: (event, data: unknown) => void) =>
    listenerHandler(EPIC_GAMES_INTEGRATION_RESULT, listener),
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
