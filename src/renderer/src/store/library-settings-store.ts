import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStoreWrapper } from "./create-conf-store-wrapper";

const conf = new Conf();

interface LibrarySettingsState {
  syncOnStartup: boolean;
}

interface LibrarySettingsActions {
  setSyncOnStartup: (syncOnStartup: LibrarySettingsState["syncOnStartup"]) => void;
}

type LibrarySettingsStore = LibrarySettingsState & LibrarySettingsActions;

export const useLibrarySettingsStore = create<LibrarySettingsStore>()(
  persist(
    (set) => ({
      syncOnStartup: true,
      setSyncOnStartup: (syncOnStartup) => set({ syncOnStartup }),
    }),
    {
      name: "library_settings",
      storage: createJSONStorage(() => createConfStoreWrapper(conf)),
    },
  ),
);
