import { Library } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import { setupPreload } from "@electron-ipc-bridge/core/preload";
import { contextBridge } from "electron";
import { exposeConf } from "electron-conf/preload";

import { EVENT_CHANNELS } from "./channels";
import { listenerHandler } from "./util/listener-handler";

void setupPreload().catch(console.error);

// Custom APIs for renderer
const api = {
  onGamesListUpdated: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_CHANNELS.GAMES_LIST_UPDATED, listener),
  // Event Listeners
  onIntegrationAuthenticationResult: (listener: (event, data: { library: Library; success: boolean }) => void) =>
    listenerHandler(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, listener),
  onNotification: (listener: (event, data: unknown) => void) => listenerHandler(EVENT_CHANNELS.NOTIFICATION, listener),
  onSyncGameStatus: (listener: (event, data: GameSyncMessage) => void) =>
    listenerHandler(EVENT_CHANNELS.GAME_SYNC_STATUS, listener),
  platform: process.platform,
};

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld("api", api);
  } catch (error) {
    console.error(error);
  }
} else {
  // @ts-expect-error (define in dts)
  window.api = api;
}

exposeConf();
