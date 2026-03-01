import { Injectable } from "@nestjs/common";
import { ExternalGameSource, GameStoreModel, Library } from "@stakload/contracts/database/games";
import { mapSortableName } from "@util/map-sortable-name";
import { removeSpecialChars } from "@util/remove-special-chars";
import { BrowserWindow } from "electron";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { GameStore } from "../../../game/game.store";
import { Logger } from "../../../logging/logging.service";
import { StakloadApiClient } from "../../../stackload-api/stakload-api.client";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
import { CLIENT_ID, GogApiService, REDIRECT_URI } from "../api/gog-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import { InstalledGamesStrategy } from "../installed-games/types";

@Injectable()
export class GogLibraryService implements SyncService {
  private installedGamesStrategy: InstalledGamesStrategy;
  library: Library = "gog";

  constructor(
    private readonly gameStore: GameStore,
    private readonly gogApiService: GogApiService,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly logger: Logger,
    private readonly StakloadApiClient: StakloadApiClient,
    private readonly windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.installedGamesStrategy = this.installedGamesRegistryService.getStrategy();
  }

  private async handleAuthenticationResponse(
    window: BrowserWindow,
    _event: unknown,
    url: string,
    _httpResponseCode: number,
    _httpStatusText: string,
  ) {
    this.logger.debug("Handling GOG authentication response", { url });
    if (url.includes("on_login_success")) {
      const code = new URL(url).searchParams.get("code");

      if (code) {
        window.close();
        try {
          const success = await this.gogApiService
            .getAuthToken(code)
            .then(() => true)
            .catch(() => false);
          this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
            library: this.library,
            success,
          });
          this.logger.log("GOG authentication completed", { success });
        } catch (error) {
          this.logger.error("GOG authentication error", error);
        }
      }
    }
  }

  async addNewGames() {
    this.logger.log("Adding new GOG games to library");
    try {
      const token = await this.gogApiService.getValidToken();

      if (!token) {
        this.logger.error("GOG Integration not set up: no valid token");
        throw new Error("GOG Integration not set up");
      }

      const ownedGames = await this.gogApiService.getOwnedGames(token);
      const existingGames = await this.gameStore.findGamesByGameIds(
        ownedGames.map((game) => String(game.id)),
        this.library,
      );
      const existingIds = existingGames.map((game) => game.gameId);
      const mappedGames = ownedGames
        .filter((game) => !existingIds.includes(String(game.id)))
        .map((game) => {
          const name = removeSpecialChars(game.title);
          return {
            gameId: String(game.id),
            library: this.library,
            name,
            sortableName: mapSortableName(name),
          };
        });

      await this.gameStore.bulkInsertGames(mappedGames);
      this.logger.log("New GOG games added", { count: mappedGames.length });
      return mappedGames.length;
    } catch (err) {
      this.logger.error("Failed to add new GOG games", err);
      return 0;
    }
  }

  async authenticate() {
    this.logger.log("Starting GOG authentication flow");
    const window = await this.windowService.createChildWindow({
      height: 430,
      networkRequestHandler: this.handleAuthenticationResponse.bind(this),
      sessionId: "gog-auth",
      url: `https://auth.gog.com/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&layout=client2`,
      width: 410,
    });
    window.show();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    this.logger.debug("Fetching game metadata from external GOG endpoint", { gameId: game.gameId });
    return await this.StakloadApiClient.getGameMetadata(game.gameId!, ExternalGameSource.Gog);
  }

  async isIntegrationValid(): Promise<boolean> {
    this.logger.debug("Validating GOG integration");
    return this.gogApiService
      .getValidToken()
      .then(() => true)
      .catch((error) => {
        this.logger.error("GOG integration validation failed", error);
        return false;
      });
  }

  async updateInstalledGames() {
    this.logger.log("Updating installed GOG games");
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
    this.logger.log("Installed games updated");
  }
}
