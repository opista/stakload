import { Conf } from "electron-conf/renderer";
import { StateStorage } from "zustand/middleware";

export const createConfStoreWrapper = (store: Conf): StateStorage => ({
  getItem: (key: string) => store.get(key) as unknown as string | null,
  removeItem: (key: string) => store.delete(key),
  setItem: (key: string, value?: unknown) => store.set(key, value),
});
