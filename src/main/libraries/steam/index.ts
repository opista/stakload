import { GameStoreModel, Library } from "@contracts/database/games";
import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { Conf } from "electron-conf/main";
import isEmpty from "lodash-es";

import { fetchGameMetadata } from "../../api/trulaunch";
import { bulkInsertGames, findGamesByGameIds, updateGameByGameId } from "../../database/games";
import { decryptString } from "../../util/safe-storage";
import { LibraryActions } from "../types";
import { getOwnedGames } from "./api";
import { createInstallationStrategy } from "./installation/create-installation-strategy";
import type { InstallationStrategy } from "./installation/types";
import { mapOwnedGameDetailsToGameStoreModel } from "./mappers/map-owned-game-details-to-game-store-model";

export class SteamLibrary implements LibraryActions {
  private library = Library.Steam;
  private installationStrategy: InstallationStrategy;

  constructor(private conf: Conf) {
    this.installationStrategy = createInstallationStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    return await fetchGameMetadata(game.gameId!, this.library);
  }

  async updateInstalledGames() {
    const installedGames = await this.installationStrategy.getInstalledGames();

    await Promise.all(
      installedGames.map((data) =>
        updateGameByGameId(data.gameId, {
          installationDetails: data.installationDetails,
          isInstalled: true,
        }),
      ),
    );
  }

  async addNewGames() {
    try {
      const config = this.conf.get("integration_settings.state.steamIntegration") as SteamIntegrationDetails;
      const webApiKey = decryptString(config.webApiKey);
      const ownedGames = await getOwnedGames(config.steamId, webApiKey);
      const existingGames = await findGamesByGameIds(
        ownedGames.map((game) => String(game.appid)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.appid)))
        .map(mapOwnedGameDetailsToGameStoreModel);

      await bulkInsertGames(mappedGames);

      return mappedGames.length;
    } catch (err) {
      console.error("Failed to get new games:", err);
      return 0;
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
