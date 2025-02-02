import { GameStoreModel, Library } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import fastq from "fastq";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { GameStore } from "../game/game.store";
import { LibraryRegistryService } from "../libraries/library-registry.service";
import { WindowService } from "../window/window.service";
import { FailureHistoryEntry, LibraryActions } from "./types";

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
    private libraryRegistryService: LibraryRegistryService,
    private windowService: WindowService,
  ) {}

  private getLIbraryImplementation(library: Library): LibraryActions | undefined {
    return this.libraryRegistryService.getLibraryImplementation(library);
  }

  private emitSyncEvent(message: GameSyncMessage) {
    this.windowService.sendEvent(EVENT_CHANNELS.GAME_SYNC_STATUS, message);
  }

  private addFailureEntry(entry: FailureHistoryEntry) {
    this.failures.push(entry);
  }

  private async libraryWorker(library: Library) {
    this.emitSyncEvent({
      action: "library",
      library,
    });

    const libraryImpl = this.getLIbraryImplementation(library);
    if (!libraryImpl) {
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

      await libraryImpl.updateInstalledGames();
    } catch (error) {
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

    const libraryImpl = this.getLIbraryImplementation(game.library);
    if (!libraryImpl) {
      this.addFailureEntry({
        action: "library",
        code: "UNSUPPORTED_LIBRARY",
        library: game.library,
      });
      return;
    }

    try {
      const metadata = await libraryImpl.getGameMetadata(game);
      await this.gameStore.updateGameById(game._id, { ...metadata, metadataSyncedAt: new Date() });
    } catch (error) {
      this.addFailureEntry({
        action: "metadata",
        code: "UNKNOWN_ERROR",
        gameName: game.name,
        library: game.library,
      });
    }
  }

  private async syncLibraries(libraries: Library[]) {
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

    this.syncInProgress = false;
  }

  sync(libraries: Library[]) {
    if (this.syncInProgress) {
      return false;
    }

    this.reset();
    this.syncInProgress = true;
    this.syncLibraries(libraries);

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
    const libraryImpl = this.getLIbraryImplementation(library);
    if (!libraryImpl) return false;

    return libraryImpl.isIntegrationValid();
  }
}
