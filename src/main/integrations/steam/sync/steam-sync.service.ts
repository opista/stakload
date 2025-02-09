import { GameStoreModel, Library } from "@contracts/database/games";
import { Service } from "typedi";

import { fetchGameMetadata } from "../../../api/trulaunch";
import { GameStore } from "../../../game/game.store";
import { SyncService } from "../../../sync/sync-registry/types";
import { SteamApiService } from "../api/steam-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import type { InstalledGamesStrategy } from "../installed-games/types";
import { mapOwnedGameDetailsToGameStoreModel } from "./mappers/map-owned-game-details-to-game-store-model";

@Service()
export class SteamLibraryService implements SyncService {
  library: Library = "steam";
  private installedGamesStrategy: InstalledGamesStrategy;

  constructor(
    private readonly gameStore: GameStore,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly steamApiService: SteamApiService,
  ) {
    this.installedGamesStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    return await fetchGameMetadata(game.gameId!, this.library);
  }

  async updateInstalledGames() {
    const installedGames = await this.installedGamesStrategy.getInstalledGames();
    const installedGameIds = installedGames.map((game) => game.gameId);

    const currentlyInstalledGames = await this.gameStore.findFilteredGames(
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
      const ownedGames = await this.steamApiService.getOwnedGames();
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
      const response = await this.steamApiService.getOwnedGames();
      return !!response;
    } catch (err) {
      console.error("Failed to validate integration:", err);
      return false;
    }
  }
}
