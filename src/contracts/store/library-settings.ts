import { SteamIntegrationDetails } from "@contracts/integrations/steam";

export type LibrarySettingsState = {
  steamIntegration?: SteamIntegrationDetails;
  syncOnStartup: boolean;
};
