import { GameStoreModel, Library, LikeLibrary } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import { Conf } from "electron-conf/main";
import fastq from "fastq";
import { Inject, Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { GameStore } from "../game/game.store";
import { EpicGamesStoreLibrary } from "../libraries/epic-games-store/epic-game-store-library";
import { SteamLibrary } from "../libraries/steam/steam-library";
import { WindowService } from "../window/window.service";
import { FailureHistoryEntry, LibraryActions } from "./types";

@Service()
export class SyncService {
  private libraryQueue = fastq.promise(this.libraryWorker.bind(this), 1);
  private metadataQueue = fastq.promise(this.metadataWorker.bind(this), 3);
  private failures: FailureHistoryEntry[] = [];
  private libraries: Partial<Record<Library, LibraryActions>>;
  private processing: number = 0;
  private syncInProgress = false;
  private total: number = 0;

  constructor(
    @Inject("conf") private conf: Conf,
    private gameStore: GameStore,
    private windowService: WindowService,
  ) {
    // TODO: This is no good. We should be able to inject the libraries into the sync service.
    this.libraries = {
      [Library.EpicGameStore]: new EpicGamesStoreLibrary(this.gameStore),
      [Library.Steam]: new SteamLibrary(this.conf, this.gameStore),
    };
  }

  private getLIbraryImplementation(library: LikeLibrary): LibraryActions | undefined {
    return this.libraries[library];
  }

  private emitSyncEvent(message: GameSyncMessage) {
    this.windowService.sendEvent(EVENT_CHANNELS.GAME_SYNC_STATUS, message);
  }

  private addFailureEntry(entry: FailureHistoryEntry) {
    this.failures.push(entry);
  }

  private async libraryWorker(library: LikeLibrary) {
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
      this.total += numberOfNewGames;

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
      total: this.total,
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

  private async syncLibraries(libraries: LikeLibrary[]) {
    await Promise.all(libraries.map((library) => this.libraryQueue.push(library)));
    await this.libraryQueue.drained();

    const unsyncedGames = await this.gameStore.findUnsyncedGames();
    await Promise.all(unsyncedGames.map((game) => this.metadataQueue.push(game)));
    await this.metadataQueue.drained();

    this.emitSyncEvent({
      action: "complete",
      hasFailures: !!this.failures.length,
      total: this.total,
    });

    this.syncInProgress = false;
  }

  sync(libraries: LikeLibrary[]) {
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
    this.total = 0;
  }

  isIntegrationValid(library: LikeLibrary) {
    const libraryImpl = this.getLIbraryImplementation(library);
    if (!libraryImpl) return false;

    return libraryImpl.isIntegrationValid();
  }
}
