import { GogInstalledBaseProduct, InstalledGameData } from "../types";

export const mapAppManifestToGameInstallationDetails = (manifest: GogInstalledBaseProduct): InstalledGameData => ({
  gameId: manifest.productId.toString(),
  installationDetails: {
    installLocation: manifest.installationPath,
    installedAt: new Date(manifest.installationDate),
  },
});
