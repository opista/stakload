import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";
import { useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

export const useSteamIntegration = () => {
  const [decryptedSteamIntegration, setDecryptedSteamIntegration] = useState<SteamIntegrationDetails | null>(null);
  const { steamIntegrationEnabled, storeSteamIntegration, setStoreSteamIntegration, toggleSteamIntegration } =
    useIntegrationSettingsStore(
      useShallow((state) => ({
        setStoreSteamIntegration: state.setSteamIntegration,
        steamIntegrationEnabled: state.steamIntegrationEnabled,
        storeSteamIntegration: state.steamIntegration,
        toggleSteamIntegration: state.toggleSteamIntegration,
      })),
    );

  useEffect(() => {
    if (!storeSteamIntegration) return;

    /**
     * TODO - Should this happen in the backend?
     * ie. fetch decrypted steam integration details?
     */
    window.api.decrypt(storeSteamIntegration.webApiKey).then((decrypted) => {
      setDecryptedSteamIntegration({
        steamId: storeSteamIntegration.steamId,
        webApiKey: decrypted,
      });
    });
  }, [storeSteamIntegration]);

  const setSteamIntegration = (integration: SteamIntegrationDetails) => {
    window.api.encrypt(integration.webApiKey).then((encrypted) => {
      setStoreSteamIntegration({
        steamId: integration.steamId,
        webApiKey: encrypted,
      });
    });
  };

  return {
    setSteamIntegration,
    steamIntegration: decryptedSteamIntegration,
    steamIntegrationEnabled,
    toggleSteamIntegration,
  };
};
