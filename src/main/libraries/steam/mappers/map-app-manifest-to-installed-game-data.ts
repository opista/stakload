import { InstalledGameData } from "../../types";
import { SteamAppManifest } from "../installation/types";

export const mapAppManifestToGameInstallationDetails = (manifest: SteamAppManifest): InstalledGameData => {
  return {
    gameId: manifest.gameId,
    installationDetails: {
      installLocation: manifest.installLocation,
      installedAt: manifest.installedAt,
      lastUpdated: manifest.lastUpdated,
      size: manifest.size,
    },
  };
};
