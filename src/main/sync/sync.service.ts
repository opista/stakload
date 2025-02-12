import { GameStoreModel, Library } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import fastq from "fastq";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { SharedConfigService } from "../config/shared-config.service";
import { GameStore } from "../game/game.store";
import { LoggerService } from "../logger/logger.service";
import { WindowService } from "../window/window.service";
import { SyncRegistryService } from "./sync-registry/sync-registry.service";
import { FailureHistoryEntry } from "./types";

@Service()
export class SyncService {
  private libraryQueue = fastq.promise(this.libraryWorker.bind(this), 1);
  private metadataQueue = fastq.promise(this.metadataWorker.bind(this), 3);
  private failures: FailureHistoryEntry[] = [];
  private processing: number = 0;
  private syncInProgress = false;
  private metadataToProcess: number = 0;
  private gamesAdded: number = 0;

  constructor(
    private gameStore: GameStore,
    private logger: LoggerService,
    private sharedConfigService: SharedConfigService,
    private syncRegistryService: SyncRegistryService,
    private windowService: WindowService,
  ) {}

  private emitSyncEvent(message: GameSyncMessage) {
    this.windowService.sendEvent(EVENT_CHANNELS.GAME_SYNC_STATUS, message);
  }

  private addFailureEntry(entry: FailureHistoryEntry) {
    this.failures.push(entry);
  }

  private async libraryWorker(library: Library) {
    this.logger.info("Initiating library sync", { library });
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
      this.logger.info("Added new games", { library, numberOfNewGames });

      await libraryImpl.updateInstalledGames();
      this.logger.info("Updated installed games", { library });
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

    this.logger.info("Starting metadata sync", {
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
      this.logger.info("Successfully synchronised metadata", {
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

  private async syncLibraries(libraries: Library[]) {
    this.logger.info("Starting sync for enabled libraries", { libraries });
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
    this.logger.info("Sync operation complete", {
      failures: this.failures.length,
      syncFailures: this.failures,
      totalGamesAdded: this.gamesAdded,
    });
    this.syncInProgress = false;
  }

  private getEnabledLibraries() {
    const libraries = this.sharedConfigService.get("integration_settings.state.integrationsEnabled");
    return Object.entries(libraries || {})
      .filter(([, enabled]) => enabled)
      .map(([library]) => library as Library);
  }

  sync() {
    if (this.syncInProgress) {
      this.logger.warn("Sync operation already in progress");
      return false;
    }

    const enabledLibraries = this.getEnabledLibraries();
    this.logger.info("Initiating sync", { enabledLibraries });
    this.reset();
    this.syncInProgress = true;
    this.syncLibraries(enabledLibraries);

    return true;
  }

  private reset() {
    this.failures = [];
    this.processing = 0;
    this.syncInProgress = false;
    this.metadataToProcess = 0;
    this.gamesAdded = 0;
  }

  isIntegrationValid(library: Library) {
    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) return false;

    return libraryImpl.isIntegrationValid();
  }

  async authenticate(library: Library, data?: unknown) {
    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) return false;

    this.logger.debug("Authenticating integration", { library });
    return libraryImpl.authenticate(data);
  }
}
