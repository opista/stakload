import { GameStoreModel, Platform } from "@contracts/database/games";
import { ElectronAPI } from "@electron-toolkit/preload";

import { RemoveListenerFunction } from "./util/listener-handler";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      clearSyncQueue: () => void;
      closeApp: () => void;
      decrypt: (str: string) => Promise<string>;
      encrypt: (str: string) => Promise<string>;
      fetch: <T>(...args: Parameters<typeof fetch>) => Promise<T>;
      getFilteredGames: () => Promise<GameStoreModel[]>;
      getGameFilters: () => Promise<Record<string, { label: string; value: string }>>;
      getGameById: (id: string) => Promise<GameStoreModel>;
      getGamesLastSyncedAt: () => Promise<Date>;
      getLocale: () => Promise<string>;
      getOS: () => Promise<Platform>;
      onGamesListUpdated: (listener: (event) => void) => RemoveListenerFunction;
      onSyncComplete: (listener: (event) => void) => RemoveListenerFunction;
      onSyncInserted: (listener: (event, count: number) => void) => RemoveListenerFunction;
      onSyncProcessed: (listener: (event, { id: string, appDetails: AppDetails }) => void) => RemoveListenerFunction;
      onSyncQueueCleared: (listener: (event) => void) => RemoveListenerFunction;
      openWebpage: (url: string) => void;
      removeGame: (id: string, preventReadd: boolean) => Promise<boolean>;
      restartApp: () => void;
      restartDevice: () => void;
      shutdownDevice: () => void;
      sleepDevice: () => void;
      syncGames: () => void;
      testLibraryIntegration: (steamid: string, webApiKey: string) => Promise<boolean>;
    };
  }
}
