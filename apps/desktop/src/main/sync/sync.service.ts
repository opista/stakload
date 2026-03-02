import { Injectable } from "@nestjs/common";
import { GAME_ICONS, GameStoreModel, Library } from "@stakload/contracts/database/games";
import { NOTIFICATION_KEYS } from "@stakload/contracts/store/notification";
import { GameSyncMessage } from "@stakload/contracts/sync";
import fastq from "fastq";

import { EVENT_CHANNELS } from "../../preload/channels";
import { SharedConfigService } from "../config/shared-config.service";
import { GameStore } from "../game/game.store";
import { Logger } from "../logging/logging.service";
import { NotificationService } from "../notification/notification.service";
import { WindowService } from "../window/window.service";
import { SyncRegistryService } from "./sync-registry/sync-registry.service";
import { FailureHistoryEntry } from "./types";

@Injectable()
export class SyncService {
  private failures: FailureHistoryEntry[] = [];
  private gamesAdded: number = 0;
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
    private windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private addFailureEntry(entry: FailureHistoryEntry) {
    this.failures.push(entry);
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
    this.processing++;
    this.emitSyncEvent({
      action: "metadata",
      processing: this.processing,
      total: this.metadataToProcess,
    });

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
      return;
    }

    try {
      const metadata = await libraryImpl.getGameMetadata(game);
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
    }
  }

  private reset() {
    this.failures = [];
    this.processing = 0;
    this.syncInProgress = false;
    this.metadataToProcess = 0;
    this.gamesAdded = 0;
  }

  private async syncLibraries(libraries: Library[]) {
    this.logger.log("Starting sync for enabled libraries", { libraries });
    await Promise.all(libraries.map((library) => this.libraryQueue.push(library)));
    await this.libraryQueue.drained();

    const unsyncedGames = await this.gameStore.findUnsyncedGames();
    this.metadataToProcess = unsyncedGames.length;

    await Promise.all(unsyncedGames.map((game) => this.metadataQueue.push(game)));
    await this.metadataQueue.drained();

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
