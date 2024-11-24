import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStoreWrapper } from "./create-conf-store-wrapper";
import { Platform } from "../schema/games";

const conf = new Conf();

interface SystemState {
  operatingSystem: Platform | null;
}

interface SystemActions {
  setOperatingSystem: (operatingSystem: Platform) => void;
}

type SystemStore = SystemState & SystemActions;

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      operatingSystem: null,
      setOperatingSystem: (operatingSystem) => set({ operatingSystem }),
    }),
    {
      name: "system",
      storage: createJSONStorage(() => createConfStoreWrapper(conf)),
    },
  ),
);
