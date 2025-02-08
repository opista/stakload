import { GameStoreModel, Library } from "@contracts/database/games";
import { Service } from "typedi";

import { fetchGameMetadata } from "../../../api/trulaunch";
import { SharedConfigService } from "../../../config/shared-config.service";
import { GameStore } from "../../../game/game.store";
import { SyncService } from "../../../sync/sync-registry/types";
import { GogApiService } from "../api/gog-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import { InstalledGamesStrategy } from "../installed-games/types";
@Service()
export class GogLibraryService implements SyncService {
  library: Library = "gog";
  private installedGamesStrategy: InstalledGamesStrategy;

  constructor(
    private readonly gogApiService: GogApiService,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly gameStore: GameStore,
    private readonly sharedConfigService: SharedConfigService,
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
      const config = await this.sharedConfigService.get("integration_settings.state.gogIntegration", { decrypt: true });

      if (!config) {
        throw new Error("GOG Integraion not set up");
      }

      const ownedGames = await this.gogApiService.getOwnedGames(config.accessToken);
      const existingGames = await this.gameStore.findGamesByGameIds(
        ownedGames.map((game) => String(game.id)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.id)))
        .map((game) => ({
          gameId: String(game.id),
          library: this.library,
          name: game.title,
          sortableName: game.title.toLowerCase(),
        }));

      await this.gameStore.bulkInsertGames(mappedGames);

      return mappedGames.length;
    } catch (err) {
      console.error("Failed to get new games:", err);
      return 0;
    }
  }

  async isIntegrationValid(): Promise<boolean> {
    return true;
  }
}
