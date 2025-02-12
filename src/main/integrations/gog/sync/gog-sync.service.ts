import { GameStoreModel, Library } from "@contracts/database/games";
import { BrowserWindow } from "electron";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../../../preload/channels";
import { fetchGameMetadata } from "../../../api/trulaunch";
import { GameStore } from "../../../game/game.store";
import { SyncService } from "../../../sync/sync-registry/types";
import { WindowService } from "../../../window/window.service";
import { CLIENT_ID, GogApiService, REDIRECT_URI } from "../api/gog-api.service";
import { InstalledGamesRegistryService } from "../installed-games/installed-games-registry.service";
import { InstalledGamesStrategy } from "../installed-games/types";
@Service()
export class GogLibraryService implements SyncService {
  library: Library = "gog";
  private installedGamesStrategy: InstalledGamesStrategy;

  constructor(
    private readonly gameStore: GameStore,
    private readonly gogApiService: GogApiService,
    private readonly installedGamesRegistryService: InstalledGamesRegistryService,
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

  async addNewGames() {
    try {
      const token = await this.gogApiService.getValidToken();

      if (!token) {
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
    return this.gogApiService
      .getValidToken()
      .then(() => true)
      .catch(() => false);
  }

  private async handleAuthenticationResponse(
    window: BrowserWindow,
    _event,
    url: string,
    _httpResponseCode: number,
    _httpStatusText: string,
  ) {
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
        } catch (error) {
          console.error("GOG auth error:", error);
        }
      }
    }
  }

  async authenticate() {
    this.windowService.createChildWindow({
      height: 430,
      networkRequestHandler: this.handleAuthenticationResponse.bind(this),
      sessionId: "gog-auth",
      url: `https://auth.gog.com/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&layout=client2`,
      width: 410,
    });
  }
}
