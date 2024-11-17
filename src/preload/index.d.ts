import { ElectronAPI } from "@electron-toolkit/preload";
import { BatteryInfo } from "../main/channels/get-battery-info";
declare global {
  interface Window {
    electron: ElectronAPI;
    api: {
      getBatteryInfo: () => Promise<BatteryInfo>;
      fetch: <T>(...args: Parameters<typeof fetch>) => Promise<T>;
      openWebpage: (url: string) => void;
    };
  }
}
