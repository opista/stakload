import { SteamIntegrationDetails } from "@contracts/integrations/steam";

export type IntegrationSettingsState = {
  epicGamesStoreIntegrationEnabled: boolean;
  gogIntegration?: {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
  };
  gogIntegrationEnabled: boolean;
  steamIntegration?: SteamIntegrationDetails;
  steamIntegrationEnabled: boolean;
  syncOnStartup: boolean;
};

export type IntegrationSettingsActions = {
  setSyncOnStartup: (syncOnStartup: IntegrationSettingsState["syncOnStartup"]) => void;
  toggleSteamIntegration: () => void;
};
