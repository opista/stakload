import { ElectronAPI } from "@electron-toolkit/preload";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
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
