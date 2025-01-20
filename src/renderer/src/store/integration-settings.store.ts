import { IntegrationSettingsActions } from "@contracts/store/integration-settings";
import { IntegrationSettingsState } from "@contracts/store/integration-settings";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

type IntegrationSettingsStore = IntegrationSettingsState & IntegrationSettingsActions;

export const useIntegrationSettingsStore = create<IntegrationSettingsStore>()(
  persist(
    (set) => ({
      setSteamIntegration: (steamIntegration) => set({ steamIntegration }),
      setSyncOnStartup: (syncOnStartup) => set({ syncOnStartup }),
      steamIntegrationEnabled: false,
      syncOnStartup: true,
      toggleSteamIntegration: () =>
        set((state) => ({
          steamIntegrationEnabled: !state.steamIntegrationEnabled,
        })),
    }),
    {
      name: "integration_settings",
      storage: createConfStorage(conf),
    },
  ),
);
