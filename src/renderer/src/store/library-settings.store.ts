import { persist } from "zustand/middleware";
import { create } from "zustand";
import { Conf } from "electron-conf/renderer";
import { createConfStorage } from "@util/create-conf-storage";
import { LibrarySettingsState } from "@contracts/store/library-settings";
import { SteamIntegrationDetails } from "@contracts/integrations/steam";

const conf = new Conf();

type LibrarySettingsActions = {
  setSteamIntegration: (encryptedIntegration: SteamIntegrationDetails) => void;
  setSyncOnStartup: (syncOnStartup: LibrarySettingsState["syncOnStartup"]) => void;
};

type LibrarySettingsStore = LibrarySettingsState & LibrarySettingsActions;

export const useLibrarySettingsStore = create<LibrarySettingsStore>()(
  persist(
    (set) => ({
      syncOnStartup: true,
      setSteamIntegration: (steamIntegration) => set({ steamIntegration }),
      setSyncOnStartup: (syncOnStartup) => set({ syncOnStartup }),
    }),
    {
      name: "library_settings",
      storage: createConfStorage(conf),
    },
  ),
);
