import { persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStorage } from "@util/create-conf-storage";
import { Platform } from "@contracts/database/games";
import { SystemState } from "@contracts/store/system";

const conf = new Conf();

type SystemActions = {
  setOperatingSystem: (operatingSystem: Platform) => void;
};

type SystemStore = SystemState & SystemActions;

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      operatingSystem: null,
      setOperatingSystem: (operatingSystem) => set({ operatingSystem }),
    }),
    {
      name: "system",
      storage: createConfStorage(conf),
    },
  ),
);
