import { GameStoreModel } from "@database/schema/games";
import { ElectronAPI } from "@electron-toolkit/preload";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getFilteredGames: () => Promise<GameStoreModel[]>;
      syncGames: (games: GameStoreModel[]) => void;
      onSyncInserted: (cb: (event, count: number) => void) => void;
      offSyncInserted: () => void;
      onSyncProcessed: (cb: (event, { id: string, appDetails: AppDetails }) => void) => void;
      offSyncProcessed: () => void;
      onSyncComplete: (cb: (event) => void) => void;
      offSyncComplete: () => void;
      getLocale: () => Promise<string>;
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
