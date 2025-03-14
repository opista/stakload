import { ExternalGameSource, GameStoreModel, Library } from "@contracts/database/games";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { StakloadApiClient } from "../../../api/stakload-api.client";
import { SharedConfigService } from "../../../config/shared-config.service";
import { GameStore } from "../../../game/game.store";
import { LoggerService } from "../../../logger/logger.service";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
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
    private readonly logger: LoggerService,
    private readonly sharedConfigService: SharedConfigService,
    private readonly steamApiService: SteamApiService,
    private readonly StakloadApiClient: StakloadApiClient,
    private readonly windowService: WindowService,
  ) {
    this.installedGamesStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    this.logger.debug("Fetching game metadata for Steam", { gameId: game.gameId });
    return await this.StakloadApiClient.getGameMetadata(game.gameId!, ExternalGameSource.Steam);
  }

  async updateInstalledGames() {
    this.logger.debug("Updating installed Steam games");
    const installedGames = await this.installedGamesStrategy.getInstalledGames();
    this.logger.debug("Installed games fetched", { count: installedGames.length });
    const installedGameIds = installedGames.map((game) => game.gameId);

    const currentlyInstalledGames = await this.gameStore.findFilteredGames(
      { isInstalled: true, libraries: [this.library] },
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
    this.logger.info("Installed Steam games updated");
  }

  getSteamCredentials() {
    const steamId = this.sharedConfigService.get("integration_settings.state.steamIntegration.steamId");
    const webApiKey = this.sharedConfigService.get("integration_settings.state.steamIntegration.webApiKey", {
      decrypt: true,
    });

    if (!steamId || !webApiKey) {
      this.logger.error("Steam credentials not found");
      throw new Error("Steam ID or web API key not found");
    }

    return { steamId, webApiKey };
  }

  async addNewGames() {
    try {
      const { steamId, webApiKey } = this.getSteamCredentials();
      this.logger.debug("Fetching owned games from Steam", { steamId });
      const ownedGames = await this.steamApiService.getOwnedGames(webApiKey, steamId);
      this.logger.debug("Owned games fetched from Steam", { count: ownedGames.length });
      const existingGames = await this.gameStore.findGamesByGameIds(
        ownedGames.map((game) => String(game.appid)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.appid)))
        .map(mapOwnedGameDetailsToGameStoreModel);

      await this.gameStore.bulkInsertGames(mappedGames);
      this.logger.info("New Steam games added", { count: mappedGames.length });
      return mappedGames.length;
    } catch (err) {
      this.logger.error("Failed to add new Steam games", err);
      return 0;
    }
  }

  async isIntegrationValid(): Promise<boolean> {
    try {
      const { steamId, webApiKey } = this.getSteamCredentials();
      const response = await this.steamApiService.getOwnedGames(webApiKey, steamId);
      return !!response;
    } catch (err) {
      this.logger.error("Failed to validate Steam integration", err);
      return false;
    }
  }

  async authenticate(data?: unknown): Promise<void> {
    const isValid = async () => {
      const { steamId, webApiKey } = data as { steamId: string; webApiKey: string };

      if (!steamId || !webApiKey) {
        this.logger.error("Steam authentication failed: missing credentials", { steamId, webApiKey });
        return false;
      }
      try {
        const response = await this.steamApiService.getOwnedGames(webApiKey, steamId);
        const success = !!response;

        if (success) {
          this.sharedConfigService.set("integration_settings.state.steamIntegration.steamId", steamId);
          this.sharedConfigService.set("integration_settings.state.steamIntegration.webApiKey", webApiKey, {
            encrypt: true,
          });
          this.logger.info("Steam authentication successful", { steamId });
        }

        return success;
      } catch (err) {
        this.logger.error("Failed to validate Steam authentication", err);
        return false;
      }
    };

    const success = await isValid();

    this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
      library: this.library,
      success,
    });
  }
}
