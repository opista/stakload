import { Library } from "@contracts/database/games";
import { SteamIntegrationDetails } from "@contracts/integrations/steam";

export type IntegrationSettingsState = {
  gogIntegration?: {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
  };
  integrationsEnabled: Record<Library, boolean>;
  steamIntegration?: SteamIntegrationDetails;
  syncOnStartup: boolean;
};

export type IntegrationSettingsActions = {
  setSyncOnStartup: (syncOnStartup: IntegrationSettingsState["syncOnStartup"]) => void;
  toggleIntegrationEnabled: (library: Library) => void;
};
