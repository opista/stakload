import { InstalledGameData, SteamAppManifest } from "../types";

export const mapAppManifestToGameInstallationDetails = (manifest: SteamAppManifest): InstalledGameData => {
  return {
    gameId: manifest.gameId,
    installationDetails: {
      installedAt: manifest.installedAt,
      installLocation: manifest.installLocation,
    },
  };
};
