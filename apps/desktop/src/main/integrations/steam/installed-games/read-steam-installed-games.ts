import fs from "fs/promises";
import path from "path";

import vdf from "vdf";

import { mapAppManifestToGameInstallationDetails } from "./mappers/map-app-manifest-to-installed-game-data";
import { InstalledGameData, SteamAppManifest, SteamAppStateFlags, SteamLibraryFolders } from "./types";

const isSteamLibraryFolder = (
  folder: SteamLibraryFolders["libraryfolders"][string],
): folder is SteamLibraryFolders["libraryfolders"][string] & { path: string } =>
  typeof folder === "object" && folder !== null && "path" in folder && typeof folder.path === "string";

export const getSteamLibraryFolders = async (applicationPath: string): Promise<string[]> => {
  const libraryFoldersPath = path.join(applicationPath, "steamapps", "libraryfolders.vdf");
  const content = await fs.readFile(libraryFoldersPath, "utf-8");
  const parsed: SteamLibraryFolders = vdf.parse(content);
  if (!parsed?.libraryfolders) {
    throw new Error("Invalid or missing libraryfolders in VDF");
  }
  return Object.values(parsed.libraryfolders)
    .filter(isSteamLibraryFolder)
    .map((folder) => folder.path);
};

export const parseSteamManifestFile = async (manifestPath: string): Promise<SteamAppManifest | null> => {
  const content = await fs.readFile(manifestPath, "utf-8");
  const manifest = vdf.parse(content);
  const state = manifest?.AppState;
  if (!state?.appid || !state.installdir) return null;

  const gameId = String(state.appid);
  const lastUpdatedUnix = Number(state.LastUpdated);
  const installedAt =
    Number.isFinite(lastUpdatedUnix) && lastUpdatedUnix > 0 ? new Date(lastUpdatedUnix * 1000) : new Date();
  const installLocation = path.join(path.dirname(manifestPath), "common", String(state.installdir));
  const isInstalled = (Number(state.StateFlags) & SteamAppStateFlags.Installed) === SteamAppStateFlags.Installed;
  if (!isInstalled) return null;

  return {
    gameId,
    installedAt,
    installLocation,
    lastUpdated: installedAt,
  };
};

export const readSteamInstalledGames = async (applicationPath: string): Promise<InstalledGameData[]> => {
  const libraries = Array.from(new Set(await getSteamLibraryFolders(applicationPath).catch(() => [applicationPath])));
  const libraryManifests = await Promise.all(
    libraries.map(async (libraryPath) => {
      const manifestPath = path.join(libraryPath, "steamapps");
      try {
        const files = await fs.readdir(manifestPath);
        const manifests = await Promise.all(
          files
            .filter((file) => file.startsWith("appmanifest_") && file.endsWith(".acf"))
            .map((file) => parseSteamManifestFile(path.join(manifestPath, file)).catch(() => null)),
        );
        return manifests.filter((manifest): manifest is SteamAppManifest => manifest !== null);
      } catch {
        return [];
      }
    }),
  );

  return libraryManifests.flat().map(mapAppManifestToGameInstallationDetails);
};
