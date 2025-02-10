import { GameStoreModel, Library } from "@contracts/database/games";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { fetchGameMetadata } from "../../../api/trulaunch";
import { SharedConfigService } from "../../../config/shared-config.service";
import { GameStore } from "../../../game/game.store";
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
    private readonly steamApiService: SteamApiService,
    private readonly sharedConfigService: SharedConfigService,
    private readonly windowService: WindowService,
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

  getSteamCredentials() {
    const steamId = this.sharedConfigService.get("integration_settings.state.steamIntegration.steamId");
    const webApiKey = this.sharedConfigService.get("integration_settings.state.steamIntegration.webApiKey", {
      decrypt: true,
    });

    if (!steamId || !webApiKey) {
      throw new Error("Steam ID or web API key not found");
    }

    return { steamId, webApiKey };
  }

  async addNewGames() {
    try {
      const { steamId, webApiKey } = this.getSteamCredentials();
      const ownedGames = await this.steamApiService.getOwnedGames(webApiKey, steamId);
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
      const { steamId, webApiKey } = this.getSteamCredentials();
      const response = await this.steamApiService.getOwnedGames(webApiKey, steamId);
      return !!response;
    } catch (err) {
      console.error("Failed to validate integration:", err);
      return false;
    }
  }

  async authenticate(data?: unknown): Promise<void> {
    const isValid = async () => {
      const { steamId, webApiKey } = data as { steamId: string; webApiKey: string };

      if (!steamId || !webApiKey) {
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
        }

        return success;
      } catch (err) {
        console.error("Failed to validate integration:", err);
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
