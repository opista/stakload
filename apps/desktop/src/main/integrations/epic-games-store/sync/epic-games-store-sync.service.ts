import { Injectable } from "@nestjs/common";
import { ExternalGameSource, GameStoreModel, Library } from "@stakload/contracts/database/games";
import { BrowserWindow } from "electron";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { GameStore } from "../../../game/game.store";
import { Logger } from "../../../logging/logging.service";
import { StakloadApiClient } from "../../../stackload-api/stakload-api.client";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
import { EpicGamesStoreApiService } from "../api/epic-games-store-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import type { InstalledGamesStrategy } from "../installed-games/types";
import { LegendaryService } from "../legendary/legendary.service";
import { mapOwnedGameToGameStoreModel } from "./mappers/map-owned-game-to-game-store-model";
@Injectable()
export class EpicGamesStoreSyncService implements SyncService {
  private installedGameStrategy: InstalledGamesStrategy;
  library: Library = "epic-game-store";

  constructor(
    private readonly epicGamesStoreApiService: EpicGamesStoreApiService,
    private readonly gameStore: GameStore,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly legendaryService: LegendaryService,
    private readonly logger: Logger,
    private readonly StakloadApiClient: StakloadApiClient,
    private readonly windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
    this.installedGameStrategy = this.installedGamesRegistryService.getStrategy();
  }

  private async handleAuthenticationResponse(
    window: BrowserWindow,
    _event: unknown,
    url: string,
    _httpResponseCode: number,
    _httpStatusText: string,
  ) {
    if (url.startsWith("https://www.epicgames.com/id/api/redirect")) {
      this.logger.debug("Handling EpicGamesStore authentication response", {
        url,
      });
      const bodyText = await window.webContents.executeJavaScript("document.body.innerText");
      const parsed = JSON.parse(bodyText);
      const { authorizationCode } = parsed;

      window.close();
      this.logger.log("Authentication window closed", { url });
      await this.legendaryService.logout();
      this.logger.debug("Logged out from LegendaryService for authentication refresh");
      const result = await this.legendaryService.login(authorizationCode);
      this.logger.log("LegendaryService authentication result", {
        success: result.success,
      });
      this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
        library: this.library,
        success: result.success,
      });
    }
  }

  async addNewGames() {
    this.logger.debug("Adding new games from EpicGamesStore integration");
    const ownedGames = await this.legendaryService.getOwnedGames();
    this.logger.log("Fetched owned games from LegendaryService", {
      count: ownedGames.length,
    });
    const existingGames = await this.gameStore.findGamesByEpicNamespace(
      ownedGames.map(({ metadata: { namespace } }) => namespace),
    );
    const existingIds = existingGames.map(({ libraryMeta }) => libraryMeta?.namespace);

    const mappedGames = ownedGames
      .filter((game) => !existingIds.includes(game.metadata.namespace))
      .map((game) => mapOwnedGameToGameStoreModel(game));

    await this.gameStore.bulkInsertGames(mappedGames);
    this.logger.log("New games added from EpicGamesStore integration", {
      count: mappedGames.length,
    });
    return mappedGames.length;
  }

  async authenticate() {
    this.logger.debug("Initiating EpicGamesStore authentication");
    const window = await this.windowService.createChildWindow({
      height: 520,
      networkRequestHandler: this.handleAuthenticationResponse.bind(this),
      sessionId: "epic-games-store-auth",
      url: "https://www.epicgames.com/id/login?redirectUrl=https%3A//www.epicgames.com/id/api/redirect%3FclientId%3D34a02cf8f4414e29b15921876da36f9a%26responseType%3Dcode",
      width: 350,
    });
    window.show();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    if (game.gameId) {
      this.logger.debug("Fetching game metadata using existing gameId", {
        gameId: game.gameId,
        name: game.name,
      });
      return await this.StakloadApiClient.getGameMetadata(game.gameId, ExternalGameSource.EpicGames);
    }
    this.logger.debug("No gameId found, fetching gameId from EpicGamesStore API", {
      name: game.name,
      namespace: game.libraryMeta!.namespace,
    });
    const gameId = await this.epicGamesStoreApiService.getGameId(game.libraryMeta!.namespace);
    if (!gameId) {
      this.logger.warn("No gameId returned from EpicGamesStore API", {
        name: game.name,
        namespace: game.libraryMeta!.namespace,
      });
      return null;
    }
    this.logger.log("Updating game with new gameId", {
      gameId,
      name: game.name,
      namespace: game.libraryMeta!.namespace,
    });
    await this.gameStore.updateGameById(game._id, { gameId });
    return await this.StakloadApiClient.getGameMetadata(gameId, ExternalGameSource.EpicGames);
  }

  async isIntegrationValid(): Promise<boolean> {
    this.logger.debug("Validating EpicGamesStore integration via LegendaryService");
    const valid = await this.legendaryService.isLoggedIn();
    this.logger.log("EpicGamesStore integration valid status", { valid });
    return valid;
  }

  async updateInstalledGames() {
    this.logger.debug("Updating installed games status", {
      library: this.library,
    });
    const installedGames = await this.installedGameStrategy.getInstalledGames();
    this.logger.log("Retrieved installed games", {
      count: installedGames.length,
    });
    const installedGameAppNames = installedGames.map((game) => game.appName);

    const currentlyInstalledGames = await this.gameStore.findFilteredGames(
      {
        isInstalled: true,
        libraries: [this.library],
      },
      "all",
    );
    const uninstalledAppNames = currentlyInstalledGames
      .map((game) => game.libraryMeta?.appName)
      .filter((appName): appName is string => !!appName && !installedGameAppNames.includes(appName));

    this.logger.log("Games to mark as uninstalled", {
      uninstalledCount: uninstalledAppNames.length,
    });
    const gamesToMarkUninstalled = uninstalledAppNames.map((appName) =>
      this.gameStore.updateGameByEpicAppName(appName, {
        installationDetails: undefined,
        isInstalled: false,
      }),
    );

    this.logger.log("Games to mark as installed", {
      installedCount: installedGames.length,
    });
    const gamesToMarkInstalled = installedGames.map(({ appName, installationDetails }) =>
      this.gameStore.updateGameByEpicAppName(appName, {
        installationDetails,
        isInstalled: true,
      }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
    this.logger.log("Installed games status update complete");
  }
}
