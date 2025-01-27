import { GameInstallationDetails, GameStoreModel, Library } from "@contracts/database/games";
import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { Conf } from "electron-conf/main";
import isEmpty from "lodash-es";

import { fetchGameMetadata } from "../../api/trulaunch";
import { findGamesByGameIds } from "../../database/games";
import { decryptString } from "../../util/safe-storage";
import { LibraryActions } from "../types";
import { getOwnedGames } from "./api";
import { createSteamInstallationStrategy } from "./installation/create-steam-installation-strategy";
import type { SteamInstallationStrategy } from "./installation/types";
import { mapOwnedGameDetailsToGameStoreModel } from "./mappers/map-owned-game-details-to-game-store-model";

export class SteamLibrary implements LibraryActions {
  private library = Library.Steam;
  private steamInstallationStrategy: SteamInstallationStrategy;

  constructor(private conf: Conf) {
    this.steamInstallationStrategy = createSteamInstallationStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    try {
      const metadata = await fetchGameMetadata(game.gameId!, this.library);
      return metadata;
    } catch (err) {
      console.error("Failed to fetch game metadata:", err);
      return null;
    }
  }

  async getInstalledGames(): Promise<GameInstallationDetails[]> {
    return this.steamInstallationStrategy.getInstalledGames();
  }

  async getNewGames(): Promise<Partial<GameStoreModel>[]> {
    try {
      const config = this.conf.get("integration_settings.state.steamIntegration") as SteamIntegrationDetails;
      const webApiKey = decryptString(config.webApiKey);
      const ownedGames = await getOwnedGames(config.steamId, webApiKey);

      const existingGames = await findGamesByGameIds(
        ownedGames.map((game) => String(game.appid)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      return ownedGames
        .filter((game) => !existingIds.includes(String(game.appid)))
        .map(mapOwnedGameDetailsToGameStoreModel);
    } catch (err) {
      console.error("Failed to get new games:", err);
      return [];
    }
  }

  async isIntegrationValid(): Promise<boolean> {
    try {
      const config = this.conf.get("integration_settings.state.steamIntegration") as SteamIntegrationDetails;
      const webApiKey = decryptString(config.webApiKey);
      const response = await getOwnedGames(config.steamId, webApiKey);
      return !isEmpty(response);
    } catch (err) {
      console.error("Failed to validate integration:", err);
      return false;
    }
  }
}
