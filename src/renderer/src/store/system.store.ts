import { Platform } from "@contracts/database/games";
import { SystemState } from "@contracts/store/system";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

export const DEFAULT_NAV_PANE_WIDTH = 300;

type SystemActions = {
  setNavigationPaneWidth: (navigationPaneWidth: number) => void;
  setOperatingSystem: (operatingSystem: Platform) => void;
};

type SystemStore = SystemState & SystemActions;

export const useSystemStore = create<SystemStore>()(
  persist(
    (set) => ({
      navigationPaneWidth: DEFAULT_NAV_PANE_WIDTH,
      operatingSystem: null,
      setNavigationPaneWidth: (navigationPaneWidth) => set({ navigationPaneWidth }),
      setOperatingSystem: (operatingSystem) => set({ operatingSystem }),
    }),
    {
      name: "system",
      storage: createConfStorage(conf),
    },
  ),
);
