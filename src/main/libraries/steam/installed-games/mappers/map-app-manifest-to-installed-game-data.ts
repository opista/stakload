import { InstalledGameData, SteamAppManifest } from "../types";

export const mapAppManifestToGameInstallationDetails = (manifest: SteamAppManifest): InstalledGameData => {
  return {
    gameId: manifest.gameId,
    installationDetails: {
      installLocation: manifest.installLocation,
      installedAt: manifest.installedAt,
    },
  };
};
