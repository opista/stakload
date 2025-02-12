import { GameStoreModel, Library } from "@contracts/database/games";
import { BrowserWindow } from "electron";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { TrulaunchApiClient } from "../../../api/trulaunch-api.client";
import { GameStore } from "../../../game/game.store";
import { LoggerService } from "../../../logger/logger.service";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
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
    private readonly epicGamesStoreApiService: EpicGamesStoreApiService,
    private readonly gameStore: GameStore,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
    private readonly legendaryService: LegendaryService,
    private readonly logger: LoggerService,
    private readonly trulaunchApiClient: TrulaunchApiClient,
    private readonly windowService: WindowService,
  ) {
    this.installedGameStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    if (game.gameId) {
      this.logger.debug("Fetching game metadata using existing gameId", {
        gameId: game.gameId,
        name: game.name,
      });
      return await this.trulaunchApiClient.getGameMetadata(game.gameId, this.library);
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
    this.logger.info("Updating game with new gameId", {
      gameId,
      name: game.name,
      namespace: game.libraryMeta!.namespace,
    });
    await this.gameStore.updateGameById(game._id, { gameId });
    return await this.trulaunchApiClient.getGameMetadata(gameId, this.library);
  }

  async updateInstalledGames() {
    this.logger.debug("Updating installed games status", { library: this.library });
    const installedGames = await this.installedGameStrategy.getInstalledGames();
    this.logger.info("Retrieved installed games", { count: installedGames.length });
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

    this.logger.info("Games to mark as uninstalled", { uninstalledCount: uninstalledAppNames.length });
    const gamesToMarkUninstalled = uninstalledAppNames.map((appName) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails: undefined, isInstalled: false }),
    );

    this.logger.info("Games to mark as installed", { installedCount: installedGames.length });
    const gamesToMarkInstalled = installedGames.map(({ appName, installationDetails }) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails, isInstalled: true }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
    this.logger.info("Installed games status update complete");
  }

  async isIntegrationValid(): Promise<boolean> {
    this.logger.debug("Validating EpicGamesStore integration via LegendaryService");
    const valid = await this.legendaryService.isLoggedIn();
    this.logger.info("EpicGamesStore integration valid status", { valid });
    return valid;
  }

  async addNewGames() {
    this.logger.debug("Adding new games from EpicGamesStore integration");
    const ownedGames = await this.legendaryService.getOwnedGames();
    this.logger.info("Fetched owned games from LegendaryService", { count: ownedGames.length });
    const existingGames = await this.gameStore.findGamesByEpicNamespace(
      ownedGames.map(({ metadata: { namespace } }) => namespace),
    );
    const existingIds = existingGames.map(({ libraryMeta }) => libraryMeta?.namespace);

    const mappedGames = ownedGames
      .filter((game) => !existingIds.includes(game.metadata.namespace))
      .map((game) => mapOwnedGameToGameStoreModel(game));

    await this.gameStore.bulkInsertGames(mappedGames);
    this.logger.info("New games added from EpicGamesStore integration", {
      count: mappedGames.length,
    });
    return mappedGames.length;
  }

  private async handleAuthenticationResponse(
    window: BrowserWindow,
    _event: unknown,
    url: string,
    _httpResponseCode: number,
    _httpStatusText: string,
  ) {
    if (url.startsWith("https://www.epicgames.com/id/api/redirect")) {
      this.logger.debug("Handling EpicGamesStore authentication response", { url });
      const bodyText = await window.webContents.executeJavaScript("document.body.innerText");
      const parsed = JSON.parse(bodyText);
      const { authorizationCode } = parsed;

      window.close();
      this.logger.info("Authentication window closed", { url });
      await this.legendaryService.logout();
      this.logger.debug("Logged out from LegendaryService for authentication refresh");
      const result = await this.legendaryService.login(authorizationCode);
      this.logger.info("LegendaryService authentication result", { success: result.success });
      this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
        library: this.library,
        success: result.success,
      });
    }
  }

  async authenticate() {
    this.logger.debug("Initiating EpicGamesStore authentication");
    this.windowService.createChildWindow({
      height: 520,
      networkRequestHandler: this.handleAuthenticationResponse.bind(this),
      sessionId: "epic-games-store-auth",
      url: "https://www.epicgames.com/id/login?redirectUrl=https%3A//www.epicgames.com/id/api/redirect%3FclientId%3D34a02cf8f4414e29b15921876da36f9a%26responseType%3Dcode",
      width: 350,
    });
    this.logger.info("Authentication window created for EpicGamesStore");
  }
}
