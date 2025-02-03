import { GameStoreModel, Library } from "@contracts/database/games";
import { Service } from "typedi";

import { fetchGameMetadata } from "../../../api/trulaunch";
import { GameStore } from "../../../game/game.store";
import { SyncService } from "../../../sync/sync-registry/types";
import { EpicGamesStoreApiService } from "../api/epic-games-store-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import type { InstalledGamesStrategy } from "../installed-games/types";
import { LegendaryService } from "../legendary/legendary.service";
import { mapOwnedGameToGameStoreModel } from "./mappers/map-owned-game-to-game-store-model";

@Service()
export class EpicGamesStoreSyncService implements SyncService {
  library: Library = "epic-game-store";
  private installedGameStrategy: InstalledGamesStrategy;

  constructor(
    private epicGamesStoreApiService: EpicGamesStoreApiService,
    private installedGamesRegistryService: InstalledGamesRegistryService,
    private legendaryService: LegendaryService,
    private readonly gameStore: GameStore,
  ) {
    this.installedGameStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    if (game.gameId) {
      return await fetchGameMetadata(game.gameId, this.library);
    }

    const gameId = await this.epicGamesStoreApiService.getGameId(game.libraryMeta!.namespace);

    if (!gameId) {
      return null;
    }

    await this.gameStore.updateGameById(game._id, { gameId });
    return await fetchGameMetadata(gameId, this.library);
  }

  async updateInstalledGames() {
    const installedGames = await this.installedGameStrategy.getInstalledGames();
    const installedGameAppNames = installedGames.map((game) => game.appName);

    const currentlyInstalledGames = await this.gameStore.findFilteredGames<GameStoreModel>(
      {
        isInstalled: true,
        libraries: [this.library],
      },
      "all",
    );
    const uninstalledAppNames = currentlyInstalledGames
      .map((game) => game.libraryMeta?.appName)
      .filter((appName): appName is string => !!appName && !installedGameAppNames.includes(appName));

    const gamesToMarkUninstalled = uninstalledAppNames.map((appName) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails: undefined, isInstalled: false }),
    );

    const gamesToMarkInstalled = installedGames.map(({ appName, installationDetails }) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails, isInstalled: true }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
  }

  async isIntegrationValid(): Promise<boolean> {
    return true;
  }

  async addNewGames() {
    const ownedGames = await this.legendaryService.getOwnedGames();
    const existingGames = await this.gameStore.findGamesByEpicNamespace(
      ownedGames.map(({ metadata: { namespace } }) => namespace),
    );
    const existingIds = existingGames.map(({ libraryMeta }) => libraryMeta?.namespace);

    const mappedGames = ownedGames
      .filter((game) => !existingIds.includes(game.metadata.namespace))
      .map((game) => mapOwnedGameToGameStoreModel(game));

    await this.gameStore.bulkInsertGames(mappedGames);

    return mappedGames.length;
  }
}
