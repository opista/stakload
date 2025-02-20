import { GameStoreModel, Library } from "@contracts/database/games";
import { BrowserWindow } from "electron";
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
    return await this.trulaunchApiClient.getGameMetadata(game.gameId!, this.library);
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
      const token = await this.battleNetApiService.getValidToken();

      if (!token) {
        this.logger.error("Battle.net Integration not set up: no valid token");
        throw new Error("Battle.net Integration not set up");
      }

      const ownedGames = await this.battleNetApiService.getOwnedGames(token);
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
          sortableName: game.title.toLocaleLowerCase(),
        }));

      await this.gameStore.bulkInsertGames(mappedGames);
      this.logger.info("New Battle.net games added", { count: mappedGames.length });
      return mappedGames.length;
    } catch (err) {
      this.logger.error("Failed to add new Battle.net games", err);
      return 0;
    }
  }

  async isIntegrationValid(): Promise<boolean> {
    this.logger.debug("Validating Battle.net integration");
    return this.battleNetApiService
      .getValidToken()
      .then(() => true)
      .catch((error) => {
        this.logger.error("Battle.net integration validation failed", error);
        return false;
      });
  }

  private async handleAuthenticationResponse(
    window: BrowserWindow,
    _event: unknown,
    url: string,
    _httpResponseCode: number,
    _httpStatusText: string,
  ) {
    this.logger.debug("Handling Battle.net authentication response", { url });
    const code = new URL(url).searchParams.get("code");

    if (code) {
      window.close();
      try {
        const success = await this.battleNetApiService
          .getAuthToken(code)
          .then(() => true)
          .catch(() => false);
        this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
          library: this.library,
          success,
        });
        this.logger.info("Battle.net authentication completed", { success });
      } catch (error) {
        this.logger.error("Battle.net authentication error", error);
      }
    }
  }

  async authenticate() {
    this.logger.info("Starting Battle.net authentication flow");
    const window = await this.windowService.createChildWindow({
      clearCookies: false,
      height: 670,
      networkRequestHandler: this.handleAuthenticationResponse.bind(this),
      sessionId: "battle-net-auth",
      url: "https://account.battle.net:443/oauth2/authorization/account-settings",
      width: 400,
    });
    await window.loadURL("https://account.battle.net/api/");
    window.show();
  }
}
