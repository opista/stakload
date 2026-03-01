import { Library } from "../database/games";
import { SteamIntegrationDetails } from "../integrations/steam";

export type IntegrationSettingsState = {
  battleNetIntegration?: {
    accessToken: string;
    expiresAt: number;
    refreshToken: string;
  };
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
