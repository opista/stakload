import { GogInstalledBaseProduct, InstalledGameData } from "../types";

export const mapAppManifestToGameInstallationDetails = (manifest: GogInstalledBaseProduct): InstalledGameData => ({
  gameId: manifest.productId.toString(),
  installationDetails: {
    installedAt: new Date(manifest.installationDate),
    installLocation: manifest.installationPath,
  },
});
