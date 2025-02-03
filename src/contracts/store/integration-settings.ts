import { SteamIntegrationDetails } from "@contracts/integrations/steam";

export type IntegrationSettingsState = {
  gogIntegration?: {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
  };
  steamIntegration?: SteamIntegrationDetails;
  steamIntegrationEnabled: boolean;
  syncOnStartup: boolean;
};

export type IntegrationSettingsActions = {
  setSteamIntegration: (encryptedIntegration: SteamIntegrationDetails) => void;
  setSyncOnStartup: (syncOnStartup: IntegrationSettingsState["syncOnStartup"]) => void;
  toggleSteamIntegration: () => void;
};
