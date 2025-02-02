import { GameStoreModel, Library } from "@contracts/database/games";
import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { Conf } from "electron-conf/main";
import { Inject, Service } from "typedi";

import { fetchGameMetadata } from "../../api/trulaunch";
import { GameStore } from "../../game/game.store";
import { LibraryActions } from "../../sync/types";
import { decryptString } from "../../util/safe-storage";
import { getOwnedGames } from "./api";
import { createInstallationStrategy } from "./installation/create-installation-strategy";
import type { InstallationStrategy } from "./installation/types";
import { mapOwnedGameDetailsToGameStoreModel } from "./mappers/map-owned-game-details-to-game-store-model";

@Service()
export class SteamLibraryService implements LibraryActions {
  library: Library = "steam";
  private installationStrategy: InstallationStrategy;

  constructor(
    @Inject("conf") private readonly conf: Conf,
    private readonly gameStore: GameStore,
  ) {
    this.installationStrategy = createInstallationStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    return await fetchGameMetadata(game.gameId!, this.library);
  }

  async updateInstalledGames() {
    const installedGames = await this.installationStrategy.getInstalledGames();
    const installedGameIds = installedGames.map((game) => game.gameId);

    const currentlyInstalledGames = await this.gameStore.findFilteredGames<GameStoreModel>(
      {
        isInstalled: true,
        libraries: [this.library],
      },
      "all",
    );
    const uninstalledGameIds = currentlyInstalledGames
      .map((game) => game.gameId)
      .filter((gameId): gameId is string => !!gameId && !installedGameIds.includes(gameId));

    const gamesToMarkUninstalled = uninstalledGameIds.map((gameId) =>
      this.gameStore.updateGameByGameId(gameId, { installationDetails: undefined, isInstalled: false }),
    );

    const gamesToMarkInstalled = installedGames.map(({ gameId, installationDetails }) =>
      this.gameStore.updateGameByGameId(gameId, { installationDetails, isInstalled: true }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
  }

  async addNewGames() {
    try {
      const config = this.conf.get("integration_settings.state.steamIntegration") as SteamIntegrationDetails;
      const webApiKey = decryptString(config.webApiKey);
      const ownedGames = await getOwnedGames(config.steamId, webApiKey);
      const existingGames = await this.gameStore.findGamesByGameIds(
        ownedGames.map((game) => String(game.appid)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.appid)))
        .map(mapOwnedGameDetailsToGameStoreModel);

      await this.gameStore.bulkInsertGames(mappedGames);

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
      return !!response;
    } catch (err) {
      console.error("Failed to validate integration:", err);
      return false;
    }
  }
}
