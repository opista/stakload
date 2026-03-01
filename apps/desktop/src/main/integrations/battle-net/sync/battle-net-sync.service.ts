import { Injectable } from "@nestjs/common";
import { GameStoreModel, Library } from "@stakload/contracts/database/games";
import { mapSortableName } from "@util/map-sortable-name";
import { removeSpecialChars } from "@util/remove-special-chars";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { GameStore } from "../../../game/game.store";
import { Logger } from "../../../logging/logging.service";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
import { BattleNetApiService } from "../api/battle-net-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import { InstalledGamesStrategy } from "../installed-games/types";

@Injectable()
export class BattleNetLibraryService implements SyncService {
  private installedGamesStrategy: InstalledGamesStrategy;
  library: Library = "battle-net";

  constructor(
    private readonly gameStore: GameStore,
    private readonly battleNetApiService: BattleNetApiService,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly logger: Logger,
    private readonly windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.installedGamesStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async addNewGames() {
    this.logger.log("Adding new Battle.net games to library");
    try {
      const ownedGames = await this.battleNetApiService.getOwnedGames();

      const existingGames = await this.gameStore.findGamesByGameIds(
        ownedGames.map((game) => String(game.titleId)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.titleId)))
        .map((game) => {
          const name = removeSpecialChars(game.localizedGameName);
          const sortableName = mapSortableName(name);
          return {
            gameId: String(game.titleId),
            library: this.library,
            name,
            sortableName,
          };
        });

      await this.gameStore.bulkInsertGames(mappedGames);
      this.logger.log("New Battle.net games added", { count: mappedGames.length });
      return mappedGames.length;
    } catch (err) {
      console.log({ err });
      this.logger.error("Failed to add new Battle.net games", err);
      return 0;
    }
  }

  async authenticate() {
    this.logger.log("Starting Battle.net authentication");
    const success = await this.battleNetApiService.authenticate();

    this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
      library: this.library,
      success,
    });
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    this.logger.debug("Fetching game metadata from external Battle.net endpoint", { gameId: game.gameId });
    // TODO: Implement this when IGDB support Battle.net games
    return null;
    // return await this.StakloadApiClient.getGameMetadata(game.gameId!, this.library);
  }

  async isIntegrationValid(): Promise<boolean> {
    return this.battleNetApiService.isAuthenticated();
  }

  async updateInstalledGames() {
    this.logger.log("Updating installed Battle.net games");
    const installedGames = await this.installedGamesStrategy.getInstalledGames();
    const installedGameIds = installedGames.map((game) => game.gameId);

    console.dir({ installedGames }, { depth: Infinity });

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

    // TODO: Maybe rather than upsert, we should check if the game already exists and update it if it does. If it doesn't, we should insert it.
    const gamesToMarkInstalled = installedGames.map(({ gameId, installationDetails, name }) =>
      this.gameStore.updateGameByGameId(
        gameId,
        {
          installationDetails,
          isInstalled: true,
          library: this.library,
          name,
          sortableName: mapSortableName(name),
        },
        { upsert: true },
      ),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
    this.logger.log("Installed games updated");
  }
}
