import { GameStoreModel } from "@database/schema/games";
import { ElectronAPI } from "@electron-toolkit/preload";
import { Platform } from "src/renderer/src/schema/games";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      decrypt: (str: string) => Promise<string>;
      encrypt: (str: string) => Promise<string>;
      getGameById: (id: string) => Promise<GameStoreModel>;
      testLibraryIntegration: (steamid: string, webApiKey: string) => Promise<boolean>;
      getFilteredGames: () => Promise<GameStoreModel[]>;
      getGamesLastSyncedAt: () => Promise<Date>;
      syncGames: () => void;
      onSyncInserted: (cb: (event, count: number) => void) => void;
      offSyncInserted: () => void;
      onSyncProcessed: (cb: (event, { id: string, appDetails: AppDetails }) => void) => void;
      offSyncProcessed: () => void;
      onSyncComplete: (cb: (event) => void) => void;
      offSyncComplete: () => void;
      getLocale: () => Promise<string>;
      getOS: () => Promise<Platform>;
      fetch: <T>(...args: Parameters<typeof fetch>) => Promise<T>;
      openWebpage: (url: string) => void;
      closeApp: () => void;
      restartApp: () => void;
      restartDevice: () => void;
      shutdownDevice: () => void;
      sleepDevice: () => void;
    };
  }
}
