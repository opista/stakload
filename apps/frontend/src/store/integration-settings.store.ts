import { create } from "zustand";
import { persist } from "zustand/middleware";

import { createPlatformConf } from "@platform/create-platform-conf";
import { Library } from "@stakload/contracts/database/games";
import { IntegrationSettingsActions } from "@stakload/contracts/store/integration-settings";
import { IntegrationSettingsState } from "@stakload/contracts/store/integration-settings";
import { createConfStorage } from "@util/create-conf-storage";

const conf = createPlatformConf();

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
      setSyncOnStartup: (syncOnStartup) => set({ syncOnStartup }),
      syncOnStartup: false,
      toggleIntegrationEnabled: (library: Library) =>
        set((state) => ({
          integrationsEnabled: {
            ...state.integrationsEnabled,
            [library]: !state.integrationsEnabled[library],
          },
        })),
    }),
    {
      name: "integration_settings",
      storage: createConfStorage(conf),
    },
  ),
);
