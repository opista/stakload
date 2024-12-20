import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { LibrarySettingsState } from "@contracts/store/library-settings";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

type LibrarySettingsActions = {
  setSteamIntegration: (encryptedIntegration: SteamIntegrationDetails) => void;
  setSyncOnStartup: (syncOnStartup: LibrarySettingsState["syncOnStartup"]) => void;
  toggleSteamIntegration: () => void;
};

type LibrarySettingsStore = LibrarySettingsState & LibrarySettingsActions;

export const useLibrarySettingsStore = create<LibrarySettingsStore>()(
  persist(
    (set) => ({
      syncOnStartup: true,
      steamIntegrationEnabled: false,
      setSteamIntegration: (steamIntegration) => set({ steamIntegration }),
      setSyncOnStartup: (syncOnStartup) => set({ syncOnStartup }),
      toggleSteamIntegration: () =>
        set((state) => ({
          steamIntegrationEnabled: !state.steamIntegrationEnabled,
        })),
    }),
    {
      name: "library_settings",
      storage: createConfStorage(conf),
    },
  ),
);
