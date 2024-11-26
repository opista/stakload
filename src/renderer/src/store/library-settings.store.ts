import { createJSONStorage, persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStoreWrapper } from "./create-conf-store-wrapper";

const conf = new Conf();

interface LibrarySettingsState {
  steamIntegration?: string;
  syncOnStartup: boolean;
}

interface LibrarySettingsActions {
  setSteamIntegration: (encryptedIntegration: string) => void;
  setSyncOnStartup: (syncOnStartup: LibrarySettingsState["syncOnStartup"]) => void;
}

type LibrarySettingsStore = LibrarySettingsState & LibrarySettingsActions;

export const useLibrarySettingsStore = create<LibrarySettingsStore>()(
  persist(
    (set) => ({
      syncOnStartup: true,
      setSteamIntegration: (encryptedIntegration) => set({ steamIntegration: encryptedIntegration }),
      setSyncOnStartup: (syncOnStartup) => set({ syncOnStartup }),
    }),
    {
      name: "library_settings",
      storage: createJSONStorage(() => createConfStoreWrapper(conf)),
    },
  ),
);
