import { storage } from "@neutralinojs/lib";

export const neutralinoStorage = {
  getItem: (key: string) => storage.getData(key),
  setItem: (key: string, value: string) => storage.setData(key, value),
  removeItem: (key: string) =>
    storage.setData(
      key,
      null as unknown as string /* Neutralino lib is incorrectly typed */
    ),
};
