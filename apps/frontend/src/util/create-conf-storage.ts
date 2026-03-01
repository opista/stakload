import { PersistStorage, StorageValue } from "zustand/middleware";

type ConfStore = {
  delete: (key: string) => Promise<void> | void;
  get: (key: string) => Promise<unknown> | unknown;
  set: (key: string, value: unknown) => Promise<void> | void;
};

export function createConfStorage<S>(store: ConfStore): PersistStorage<S> | undefined {
  const persistStorage: PersistStorage<S> = {
    getItem: async (key: string) => {
      const str = await store.get(key);
      return str as StorageValue<S>;
    },
    removeItem: (key: string) => store.delete(key),
    setItem: (key: string, value: StorageValue<S>) => {
      const cleaned = JSON.parse(JSON.stringify(value, null, "\t"));
      return store.set(key, cleaned);
    },
  };

  return persistStorage;
}
