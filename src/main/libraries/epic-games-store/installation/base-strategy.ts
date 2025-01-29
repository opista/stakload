import fs from "fs/promises";
import path from "path";

import { InstallationStrategy, InstalledGameData } from "./types";

interface EpicInstallation {
  AppName: string;
  InstallLocation: string;
  NamespaceId: string;
}

export abstract class BaseInstallationStrategy implements InstallationStrategy {
  abstract applicationPath: string | undefined;

  abstract getApplicationPath(): Promise<string>;

  async getLibraryFolders(): Promise<string[]> {
    const epicPath = await this.getApplicationPath();
    const launcherDataPath = path.join(epicPath, "UnrealEngineLauncher", "LauncherInstalled.dat");

    try {
      const content = await fs.readFile(launcherDataPath, "utf-8");
      const parsed = JSON.parse(content) as { InstallationList: EpicInstallation[] };
      return [...new Set(parsed.InstallationList.map((install) => install.InstallLocation))];
    } catch (err) {
      console.error("Failed to parse Epic Games library folders", err);
      return [epicPath];
    }
  }

  async getInstalledGames(): Promise<InstalledGameData[]> {
    const epicPath = await this.getApplicationPath();
    const manifestPath = path.join(epicPath, "UnrealEngineLauncher", "LauncherInstalled.dat");

    try {
      const content = await fs.readFile(manifestPath, "utf-8");
      const parsed = JSON.parse(content) as { InstallationList: EpicInstallation[] };

      return parsed.InstallationList.map((install) => ({
        appName: install.AppName,
        installationDetails: {
          installLocation: install.InstallLocation,
          installedAt: new Date(),
        },
      }));
    } catch (err) {
      console.error("Failed to get installed Epic games", err);
      return [];
    }
  }
}
