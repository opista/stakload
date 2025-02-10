import { GameStoreModel, Library } from "@contracts/database/games";
import { BrowserWindow } from "electron";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { fetchGameMetadata } from "../../../api/trulaunch";
import { GameStore } from "../../../game/game.store";
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
    private readonly windowService: WindowService,
  ) {
    this.installedGameStrategy = this.installedGamesRegistryService.getStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    if (game.gameId) {
      return await fetchGameMetadata(game.gameId, this.library);
    }

    const gameId = await this.epicGamesStoreApiService.getGameId(game.libraryMeta!.namespace);

    if (!gameId) {
      return null;
    }

    await this.gameStore.updateGameById(game._id, { gameId });
    return await fetchGameMetadata(gameId, this.library);
  }

  async updateInstalledGames() {
    const installedGames = await this.installedGameStrategy.getInstalledGames();
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

    const gamesToMarkUninstalled = uninstalledAppNames.map((appName) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails: undefined, isInstalled: false }),
    );

    const gamesToMarkInstalled = installedGames.map(({ appName, installationDetails }) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails, isInstalled: true }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
  }

  async isIntegrationValid(): Promise<boolean> {
    return await this.legendaryService.isLoggedIn();
  }

  async addNewGames() {
    const ownedGames = await this.legendaryService.getOwnedGames();
    const existingGames = await this.gameStore.findGamesByEpicNamespace(
      ownedGames.map(({ metadata: { namespace } }) => namespace),
    );
    const existingIds = existingGames.map(({ libraryMeta }) => libraryMeta?.namespace);

    const mappedGames = ownedGames
      .filter((game) => !existingIds.includes(game.metadata.namespace))
      .map((game) => mapOwnedGameToGameStoreModel(game));

    await this.gameStore.bulkInsertGames(mappedGames);

    return mappedGames.length;
  }

  private async handleAuthenticationResponse(
    window: BrowserWindow,
    _event,
    url: string,
    _httpResponseCode: number,
    _httpStatusText: string,
  ) {
    if (url.startsWith("https://www.epicgames.com/id/api/redirect")) {
      const bodyText = await window.webContents.executeJavaScript("document.body.innerText");
      const parsed = JSON.parse(bodyText);

      const { authorizationCode } = parsed;

      window.close();

      await this.legendaryService.logout();
      const result = await this.legendaryService.login(authorizationCode);

      this.windowService.sendEvent(EVENT_CHANNELS.INTEGRATION_AUTH_RESULT, {
        library: this.library,
        success: result.success,
      });
    }
  }

  async authenticate() {
    this.windowService.createChildWindow({
      height: 520,
      networkRequestHandler: this.handleAuthenticationResponse.bind(this),
      sessionId: "epic-games-store-auth",
      url: "https://www.epicgames.com/id/login?redirectUrl=https%3A//www.epicgames.com/id/api/redirect%3FclientId%3D34a02cf8f4414e29b15921876da36f9a%26responseType%3Dcode",
      width: 350,
    });
  }
}
