import { Library } from "@contracts/database/games";
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
      integrationsEnabled: {
        "battle-net": false,
        "epic-game-store": false,
        gog: false,
        steam: false,
      },
      toggleIntegrationEnabled: (library: Library) =>
        set((state) => ({
          integrationsEnabled: {
            ...state.integrationsEnabled,
            [library]: !state.integrationsEnabled[library],
          },
        })),
      setSyncOnStartup: (syncOnStartup) => set({ syncOnStartup }),
      syncOnStartup: false,
    }),
    {
      name: "integration_settings",
      storage: createConfStorage(conf),
    },
  ),
);
