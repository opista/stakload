import { GameInstallationDetails } from "@stakload/contracts/database/games";

export const BATTLE_NET_INSTALLED_GAMES_STRATEGY = Symbol("BATTLE_NET_INSTALLED_GAMES_STRATEGY");

export interface BattleNetInstallationData {
  installLocation: string;
  lastPlayed?: number;
  productId: string;
  uid: string;
}

export interface InstalledGameData {
  gameId: string;
  installationDetails: GameInstallationDetails;
  name: string;
}

export interface InstalledGamesStrategy {
  getApplicationPath(): Promise<string>;
  getInstalledGames(): Promise<InstalledGameData[]>;
}
