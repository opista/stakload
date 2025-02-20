import { GameStoreModel, Library } from "@contracts/database/games";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { TrulaunchApiClient } from "../../../api/trulaunch-api.client";
import { GameStore } from "../../../game/game.store";
import { LoggerService } from "../../../logger/logger.service";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
import { BattleNetApiService } from "../api/battle-net-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import { InstalledGamesStrategy } from "../installed-games/types";

@Service()
export class BattleNetLibraryService implements SyncService {
  library: Library = "battle-net";
  private installedGamesStrategy: InstalledGamesStrategy;

  constructor(
    private readonly gameStore: GameStore,
    private readonly battleNetApiService: BattleNetApiService,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly logger: LoggerService,
    private readonly trulaunchApiClient: TrulaunchApiClient,
    private readonly windowService: WindowService,
  ) {
    this.installedGamesStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    this.logger.debug("Fetching game metadata from external Battle.net endpoint", { gameId: game.gameId });
    return null;
    // return await this.trulaunchApiClient.getGameMetadata(game.gameId!, this.library);
  }

  async updateInstalledGames() {
    this.logger.info("Updating installed Battle.net games");
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
    this.logger.info("Installed games updated");
  }

  async addNewGames() {
    this.logger.info("Adding new Battle.net games to library");
    try {
      const ownedGames = await this.battleNetApiService.getOwnedGames();

      console.log({ ownedGames });

      const existingGames = await this.gameStore.findGamesByGameIds(
        ownedGames.map((game) => String(game.titleId)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.titleId)))
        .map((game) => ({
          gameId: String(game.titleId),
          library: this.library,
          name: game.localizedGameName,
          sortableName: game.localizedGameName.toLocaleLowerCase(),
        }));

      await this.gameStore.bulkInsertGames(mappedGames);
      this.logger.info("New Battle.net games added", { count: mappedGames.length });
      return mappedGames.length;
    } catch (err) {
      console.log({ err });
      this.logger.error("Failed to add new Battle.net games", err);
      return 0;
    }
  }

  async authenticate() {
    this.logger.info("Starting Battle.net authentication");
    const success = await this.battleNetApiService.authenticate();

    this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
      library: this.library,
      success,
    });
  }

  async isIntegrationValid(): Promise<boolean> {
    return this.battleNetApiService.isAuthenticated();
  }
}
