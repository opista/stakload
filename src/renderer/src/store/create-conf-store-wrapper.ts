import { Conf } from "electron-conf/renderer";
import { StateStorage } from "zustand/middleware";

export const createConfStoreWrapper = (store: Conf, context: string): StateStorage => ({
  getItem: (key: string) => store.get(`${context}.${key}`) as unknown as string | null,
  removeItem: (key: string) => store.delete(`${context}.${key}`),
  setItem: (key: string, value?: unknown) => store.set(`${context}.${key}`, value),
});
