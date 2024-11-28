import { GameStoreModel } from "@database/schema/games";
import { ElectronAPI } from "@electron-toolkit/preload";
import { Platform } from "src/renderer/src/schema/games";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      closeApp: () => void;
      decrypt: (str: string) => Promise<string>;
      encrypt: (str: string) => Promise<string>;
      fetch: <T>(...args: Parameters<typeof fetch>) => Promise<T>;
      getFilteredGames: () => Promise<GameStoreModel[]>;
      getGameById: (id: string) => Promise<GameStoreModel>;
      getGamesLastSyncedAt: () => Promise<Date>;
      getLocale: () => Promise<string>;
      getOS: () => Promise<Platform>;
      offGamesListUpdated: (listenerId: string) => void;
      offSyncComplete: (listenerId: string) => void;
      offSyncInserted: (listenerId: string) => void;
      offSyncProcessed: (listenerId: string) => void;
      onGamesListUpdated: (listener: (event) => void) => string;
      onSyncComplete: (listener: (event) => void) => string;
      onSyncInserted: (listener: (event, count: number) => void) => string;
      onSyncProcessed: (listener: (event, { id: string, appDetails: AppDetails }) => void) => string;
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
