import { SteamManifestData } from "@contracts/database/games";
import * as fs from "fs/promises";
import * as path from "path";
import * as vdf from "vdf";
import Registry from "winreg";

enum SteamAppStateFlags {
  Invalid = 0,
  Uninstalled = 1,
  UpdateRequired = 2,
  Installed = 4,
}

export class SteamInstallationService {
  private steamPath: string | null = null;
  private libraryFolders: string[] = [];

  private async getSteamPath(): Promise<string> {
    if (this.steamPath) return this.steamPath;

    const reg = new Registry({
      hive: Registry.HKLM,
      key: "\\SOFTWARE\\WOW6432Node\\Valve\\Steam",
    });

    return new Promise((resolve, reject) => {
      reg.get("InstallPath", (err, item) => {
        if (err) reject(err);
        if (!item?.value) reject(new Error("Steam installation not found"));
        this.steamPath = item.value;
        resolve(item.value);
      });
    });
  }

  public async getLibraryFolders(): Promise<string[]> {
    if (this.libraryFolders.length) return this.libraryFolders;

    const steamPath = await this.getSteamPath();
    const libraryFoldersPath = path.join(steamPath, "steamapps", "libraryfolders.vdf");

    try {
      const content = await fs.readFile(libraryFoldersPath, "utf-8");
      const parsed = vdf.parse(content);

      this.libraryFolders = Object.values(parsed.libraryfolders).map((folder: any) => folder.path);

      return this.libraryFolders;
    } catch (err) {
      console.error("Failed to parse Steam library folders", err);
      return [steamPath];
    }
  }

  private async parseManifestFile(manifestPath: string): Promise<SteamManifestData | null> {
    try {
      const content = await fs.readFile(manifestPath, "utf-8");
      const manifest = vdf.parse(content);
      const state = manifest.AppState;

      const isInstalled = Number(state.StateFlags) === SteamAppStateFlags.Installed;

      if (!isInstalled) return null;

      return {
        gameId: state.appid,
        installLocation: path.join(path.dirname(manifestPath), "common", state.installdir),
        installedAt: new Date(state.LastUpdated * 1000),
        lastUpdated: new Date(state.LastUpdated * 1000),
        size: parseInt(state.SizeOnDisk, 10),
      };
    } catch (err) {
      console.error(`Failed to parse manifest file: ${manifestPath}`, err);
      return null;
    }
  }

  public async getInstalledGames(): Promise<SteamManifestData[]> {
    const installations: SteamManifestData[] = [];
    const libraries = await this.getLibraryFolders();

    for (const libraryPath of libraries) {
      const manifestPath = path.join(libraryPath, "steamapps");

      try {
        const files = await fs.readdir(manifestPath);

        for (const file of files) {
          if (!file.startsWith("appmanifest_") || !file.endsWith(".acf")) continue;

          const manifestData = await this.parseManifestFile(path.join(manifestPath, file));

          if (manifestData) {
            installations.push(manifestData);
          }
        }
      } catch (err) {
        console.error(`Failed to read library path: ${libraryPath}`, err);
        continue;
      }
    }

    return installations;
  }
}
