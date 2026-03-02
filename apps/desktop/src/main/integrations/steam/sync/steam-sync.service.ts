import { Injectable } from "@nestjs/common";
import { ExternalGameSource, GameStoreModel, Library } from "@stakload/contracts/database/games";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { SharedConfigService } from "../../../config/shared-config.service";
import { GameStore } from "../../../game/game.store";
import { Logger } from "../../../logging/logging.service";
import { StakloadApiClient } from "../../../stackload-api/stakload-api.client";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
import { SteamApiService } from "../api/steam-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import type { InstalledGamesStrategy } from "../installed-games/types";
import { mapOwnedGameDetailsToGameStoreModel } from "./mappers/map-owned-game-details-to-game-store-model";
@Injectable()
export class SteamLibraryService implements SyncService {
  private installedGamesStrategy: InstalledGamesStrategy;
  library: Library = "steam";

  constructor(
    private readonly gameStore: GameStore,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly logger: Logger,
    private readonly sharedConfigService: SharedConfigService,
    private readonly steamApiService: SteamApiService,
    private readonly StakloadApiClient: StakloadApiClient,
    private readonly windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.installedGamesStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async addNewGames() {
    try {
      const { steamId, webApiKey } = this.getSteamCredentials();
      this.logger.debug("Fetching owned games from Steam", { steamId });
      const ownedGames = await this.steamApiService.getOwnedGames(webApiKey, steamId);
      this.logger.debug("Owned games fetched from Steam", {
        count: ownedGames.length,
      });
      const existingGames = await this.gameStore.findGamesByGameIds(
        ownedGames.map((game) => String(game.appid)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);

      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.appid)))
        .map(mapOwnedGameDetailsToGameStoreModel);

      await this.gameStore.bulkInsertGames(mappedGames);
      this.logger.log("New Steam games added", { count: mappedGames.length });
      return mappedGames.length;
    } catch (err) {
      this.logger.error("Failed to add new Steam games", err);
      return 0;
    }
  }

  async authenticate(data?: unknown): Promise<void> {
    const isValid = async () => {
      const { steamId, webApiKey } = data as {
        steamId: string;
        webApiKey: string;
      };

      if (!steamId || !webApiKey) {
        this.logger.error("Steam authentication failed: missing credentials", {
          steamId,
          webApiKey,
        });
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
          this.logger.log("Steam authentication successful", { steamId });
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

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    this.logger.debug("Fetching game metadata for Steam", {
      gameId: game.gameId,
    });
    return await this.StakloadApiClient.getGameMetadata(game.gameId!, ExternalGameSource.Steam);
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

  async updateInstalledGames() {
    this.logger.debug("Updating installed Steam games");
    const installedGames = await this.installedGamesStrategy.getInstalledGames();
    this.logger.debug("Installed games fetched", {
      count: installedGames.length,
    });
    const installedGameIds = installedGames.map((game) => game.gameId);

    const currentlyInstalledGames = await this.gameStore.findFilteredGames(
      { isInstalled: true, libraries: [this.library] },
      "all",
    );
    const uninstalledGameIds = currentlyInstalledGames
      .map((game) => game.gameId)
      .filter((gameId): gameId is string => !!gameId && !installedGameIds.includes(gameId));

    const gamesToMarkUninstalled = uninstalledGameIds.map((gameId) =>
      this.gameStore.updateGameByGameId(gameId, {
        installationDetails: undefined,
        isInstalled: false,
      }),
    );

    const gamesToMarkInstalled = installedGames.map(({ gameId, installationDetails }) =>
      this.gameStore.updateGameByGameId(gameId, {
        installationDetails,
        isInstalled: true,
      }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
    this.logger.log("Installed Steam games updated");
  }
}
