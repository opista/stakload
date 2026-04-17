import { Injectable } from "@nestjs/common";
import fastq from "fastq";

import { GAME_ICONS, GameStoreModel, Library } from "@stakload/contracts/database/games";
import { NOTIFICATION_KEYS } from "@stakload/contracts/store/notification";
import { GameSyncMessage } from "@stakload/contracts/sync";

import { EVENT_CHANNELS } from "../../preload/channels";
import { SharedConfigService } from "../config/shared-config.service";
import { GameStore } from "../game/game.store";
import { mapOwnedGameDetailsToGameStoreModel } from "../integrations/steam/sync/mappers/map-owned-game-details-to-game-store-model";
import { SteamSyncWorkerService } from "../integrations/steam/sync/steam-sync-worker.service";
import { SteamLibraryService } from "../integrations/steam/sync/steam-sync.service";
import { Logger } from "../logging/logging.service";
import { NotificationService } from "../notification/notification.service";
import { getStakloadApiBaseUrl } from "../stackload-api/get-base-url";
import { WindowService } from "../window/window.service";
import { SyncRegistryService } from "./sync-registry/sync-registry.service";
import { FailureHistoryEntry } from "./types";

@Injectable()
export class SyncService {
  private failures: FailureHistoryEntry[] = [];
  private gamesAdded: number = 0;
  private lastMetadataEventAt: number = 0;
  private libraryQueue = fastq.promise(this.libraryWorker.bind(this), 1);
  private metadataQueue = fastq.promise(this.metadataWorker.bind(this), 3);
  private metadataToProcess: number = 0;
  private processing: number = 0;
  private syncInProgress = false;

  constructor(
    private gameStore: GameStore,
    private logger: Logger,
    private notificationService: NotificationService,
    private sharedConfigService: SharedConfigService,
    private syncRegistryService: SyncRegistryService,
    private steamLibraryService: SteamLibraryService,
    private steamSyncWorkerService: SteamSyncWorkerService,
    private windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private addFailureEntry(entry: FailureHistoryEntry) {
    this.failures.push(entry);
  }

  private emitMetadataProgress(force = false) {
    if (!this.metadataToProcess) return;
    const now = Date.now();
    const shouldEmit = force || this.processing >= this.metadataToProcess || now - this.lastMetadataEventAt >= 250;
    if (!shouldEmit) return;

    this.lastMetadataEventAt = now;
    this.emitSyncEvent({
      action: "metadata",
      processing: this.processing,
      total: this.metadataToProcess,
    });
  }

  private emitSyncEvent(message: GameSyncMessage) {
    this.windowService.sendEvent(EVENT_CHANNELS.GAME_SYNC_STATUS, message);
  }

  private getEnabledLibraries() {
    const libraries = this.sharedConfigService.get("integration_settings.state.integrationsEnabled");
    return Object.entries(libraries || {})
      .filter(([, enabled]) => enabled)
      .map(([library]) => library as Library);
  }

  private async libraryWorker(library: Library) {
    this.logger.log("Initiating library sync", { library });
    this.emitSyncEvent({
      action: "library",
      library,
    });

    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) {
      this.logger.error("Library integration not supported", { library });
      this.addFailureEntry({
        action: "library",
        code: "UNSUPPORTED_LIBRARY",
        library,
      });
      return;
    }

    try {
      if (library === "steam") {
        await this.synchroniseSteamLibrary();
        return;
      }

      const numberOfNewGames = await libraryImpl.addNewGames();
      this.gamesAdded += numberOfNewGames;
      this.logger.log("Added new games", { library, numberOfNewGames });

      await libraryImpl.updateInstalledGames();
      this.logger.log("Updated installed games", { library });
    } catch (error: unknown) {
      this.logger.error("Error synchronising library", { error, library });
      this.addFailureEntry({
        action: "library",
        code: "AUTHENTICATION_ERROR",
        library,
      });
    }
  }

  private async metadataWorker(game: GameStoreModel) {
    this.logger.log("Starting metadata sync", {
      game: game.name,
      library: game.library,
    });

    const libraryImpl = this.syncRegistryService.getLibrary(game.library);
    if (!libraryImpl) {
      this.logger.error("Library integration not supported", {
        library: game.library,
      });
      this.addFailureEntry({
        action: "library",
        code: "UNSUPPORTED_LIBRARY",
        library: game.library,
      });
      this.processing++;
      this.emitMetadataProgress();
      return;
    }

    try {
      const metadata = await libraryImpl.getGameMetadata(game);
      if (!metadata) {
        this.logger.warn("No metadata returned for game", {
          game: game.name,
          library: game.library,
        });
        this.addFailureEntry({
          action: "metadata",
          code: "UNKNOWN_ERROR",
          gameName: game.name,
          library: game.library,
        });
        return;
      }

      await this.gameStore.updateGameById(game._id, {
        ...metadata,
        metadataSyncedAt: new Date(),
      });
      this.logger.log("Successfully synchronised metadata", {
        game: game.name,
        library: game.library,
      });
    } catch (error: unknown) {
      this.logger.error("Error synchronising metadata", {
        error,
        game: game.name,
        library: game.library,
      });
      this.addFailureEntry({
        action: "metadata",
        code: "UNKNOWN_ERROR",
        gameName: game.name,
        library: game.library,
      });
    } finally {
      this.processing++;
      this.emitMetadataProgress();
    }
  }

  private reset() {
    this.failures = [];
    this.processing = 0;
    this.syncInProgress = false;
    this.metadataToProcess = 0;
    this.gamesAdded = 0;
    this.lastMetadataEventAt = 0;
  }

  private async synchroniseSteamLibrary() {
    const { applicationPath, steamId, webApiKey } = await this.steamLibraryService.getSyncContext();
    const { installedGames, ownedGames } = await this.steamSyncWorkerService.runLibraryJob({
      applicationPath,
      steamId,
      webApiKey,
    });
    const existingGames = await this.gameStore.findGamesByGameIds(
      ownedGames.map((game) => String(game.appid)),
      "steam",
    );
    const existingIds = new Set(existingGames.map((game) => game.gameId));
    const mappedGames = ownedGames
      .filter((game) => !existingIds.has(String(game.appid)))
      .map(mapOwnedGameDetailsToGameStoreModel);

    if (mappedGames.length) {
      await this.gameStore.bulkInsertGames(mappedGames);
    }

    await this.gameStore.reconcileInstalledGames("steam", installedGames);
    this.gamesAdded += mappedGames.length;

    this.logger.log("Steam library sync complete", {
      gamesAdded: mappedGames.length,
      installedCount: installedGames.length,
      ownedCount: ownedGames.length,
    });
  }

  private async synchroniseSteamMetadata(games: GameStoreModel[]) {
    if (!games.length) return;

    await this.steamSyncWorkerService.runMetadataJob(
      {
        apiBaseUrl: getStakloadApiBaseUrl(),
        games: games.map(({ _id, gameId, name }) => ({ _id, gameId, name })),
      },
      async (results, progress) => {
        const successfulEntries = results.flatMap((result) =>
          result.status === "success"
            ? [
                {
                  id: result.game._id,
                  metadata: result.metadata,
                },
              ]
            : [],
        );

        if (successfulEntries.length) {
          await this.gameStore.applyMetadataSyncBatch(successfulEntries);
        }

        results
          .filter((result) => result.status === "failure")
          .forEach((result) => {
            this.logger.warn("Steam metadata synchronisation failed", {
              error: result.error,
              game: result.game.name,
            });
            this.addFailureEntry({
              action: "metadata",
              code: "UNKNOWN_ERROR",
              gameName: result.game.name,
              library: "steam",
            });
          });

        this.processing += results.length;
        this.emitMetadataProgress(progress.processed === progress.total);
      },
    );
  }

  private async syncLibraries(libraries: Library[]) {
    try {
      this.logger.log("Starting sync for enabled libraries", { libraries });
      await Promise.all(libraries.map((library) => this.libraryQueue.push(library)));
      await this.libraryQueue.drained();

      const unsyncedGames = await this.gameStore.findUnsyncedGames();
      this.metadataToProcess = unsyncedGames.length;
      const steamGames = unsyncedGames.filter((game) => game.library === "steam");
      const otherGames = unsyncedGames.filter((game) => game.library !== "steam");

      await this.synchroniseSteamMetadata(steamGames);
      await Promise.all(otherGames.map((game) => this.metadataQueue.push(game)));
      await this.metadataQueue.drained();
      this.emitMetadataProgress(true);
    } catch (error: unknown) {
      this.logger.error("Sync operation failed", { error });
      this.addFailureEntry({
        action: "metadata",
        code: "UNKNOWN_ERROR",
      });
    } finally {
      this.emitSyncEvent({
        action: "complete",
        hasFailures: !!this.failures.length,
        total: this.gamesAdded,
      });
      this.logger.log("Sync operation complete", {
        failures: this.failures.length,
        syncFailures: this.failures,
        totalGamesAdded: this.gamesAdded,
      });
      this.syncInProgress = false;
    }
  }

  async authenticate(library: Library, data?: unknown) {
    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) return false;

    this.logger.debug("Authenticating integration", { library });
    return libraryImpl.authenticate(data);
  }

  async isIntegrationValid(library: Library) {
    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) return false;

    const isValid = await libraryImpl.isIntegrationValid();

    if (isValid) {
      this.notificationService.success({
        icon: GAME_ICONS[library],
        message: NOTIFICATION_KEYS.INTEGRATION_SUCCESS_MESSAGE,
        title: NOTIFICATION_KEYS.INTEGRATION_SUCCESS_TITLE,
      });
    } else {
      this.notificationService.error({
        icon: GAME_ICONS[library],
        message: NOTIFICATION_KEYS.INTEGRATION_FAILED_MESSAGE,
        title: NOTIFICATION_KEYS.INTEGRATION_FAILED_TITLE,
      });
    }

    return isValid;
  }

  sync() {
    if (this.syncInProgress) {
      this.logger.warn("Sync operation already in progress");
      return false;
    }

    const enabledLibraries = this.getEnabledLibraries();
    this.logger.log("Initiating sync", { enabledLibraries });
    this.reset();
    this.syncInProgress = true;
    void this.syncLibraries(enabledLibraries);

    return true;
  }
}
