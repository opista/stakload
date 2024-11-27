import { persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { Platform } from "../schema/games";
import { createConfStorage } from "@util/create-conf-storage";

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
      storage: createConfStorage(conf),
    },
  ),
);
