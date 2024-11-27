import { Conf } from "electron-conf/renderer";
import { PersistStorage, StorageValue } from "zustand/middleware";

export function createConfStorage<S>(store: Conf): PersistStorage<S> | undefined {
  const persistStorage: PersistStorage<S> = {
    getItem: async (key: string) => {
      const str = await store.get(key);
      return str as StorageValue<S>;
    },
    setItem: (key: string, value: StorageValue<S>) => {
      const cleaned = JSON.parse(JSON.stringify(value, null, "\t"));
      return store.set(key, cleaned);
    },
    removeItem: (key: string) => store.delete(key),
  };

  return persistStorage;
}
