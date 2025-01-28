import { GameStoreModel, Library, LikeLibrary } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import { WebContents } from "electron";
import { Conf } from "electron-conf/main";
import fastq from "fastq";

import { EVENT_GAME_SYNC_STATUS } from "../../preload/channels";
import { bulkInsertGames, findUnsyncedGames, updateGameByGameId, updateGameById } from "../database/games";
import { SteamLibrary } from "../libraries/steam";
import { LibraryActions } from "../libraries/types";

export class GameSyncManager {
  private libraries: Partial<Record<Library, LibraryActions>>;
  private libraryQueue = fastq.promise(this.libraryWorker.bind(this), 1);
  private metadataQueue = fastq.promise(this.metadataWorker.bind(this), 3);
  private processing: number = 0;
  private syncInProgress = false;
  private total: number = 0;

  constructor(
    private webContents: WebContents,
    private conf: Conf,
  ) {
    this.libraries = {
      [Library.Steam]: new SteamLibrary(this.conf),
    };
  }

  private emitSyncEvent(message: GameSyncMessage) {
    console.log(message);
    this.webContents.send(EVENT_GAME_SYNC_STATUS, message);
  }

  private reset() {
    this.processing = 0;
    this.syncInProgress = false;
    this.total = 0;
  }

  private async libraryWorker(library: LikeLibrary) {
    const libraryImpl = this.libraries[library];
    if (!libraryImpl) {
      this.emitSyncEvent({
        action: "error",
        code: "UNSUPPORTED_LIBRARY",
      });
      return;
    }
    // TODO: Figure out translation - may need to pass key to frontend
    this.emitSyncEvent({
      action: "syncing",
      library,
    });
    const newGames = await libraryImpl.getNewGames();
    this.total += newGames.length;
    await bulkInsertGames(newGames);

    const installedGames = await libraryImpl.getInstalledGames();

    await Promise.all(
      installedGames.map((data) =>
        updateGameByGameId(data.gameId, {
          installationDetails: data.installationDetails,
          isInstalled: true,
        }),
      ),
    );
  }

  private async metadataWorker(game: GameStoreModel) {
    this.processing++;
    this.emitSyncEvent({
      action: "metadata",
      processing: this.processing,
      total: this.total,
    });

    const libraryImpl = this.libraries[game.library];

    if (!libraryImpl) {
      this.emitSyncEvent({
        action: "error",
        code: "UNSUPPORTED_LIBRARY",
      });
      return;
    }

    const metadata = await libraryImpl.getGameMetadata(game);
    await updateGameById(game._id, { ...metadata, metadataSyncedAt: new Date() });
  }

  private async syncLibraries(libraries: LikeLibrary[]) {
    await Promise.all(libraries.map((library) => this.libraryQueue.push(library)));
    await this.libraryQueue.drained();

    const unsyncedGames = await findUnsyncedGames();
    await Promise.all(unsyncedGames.map((game) => this.metadataQueue.push(game)));
    await this.metadataQueue.drained();

    this.emitSyncEvent({
      action: "complete",
      processed: this.processing,
      total: this.total,
    });

    this.reset();
  }

  sync(libraries: LikeLibrary[]) {
    if (this.syncInProgress) {
      return false;
    }

    this.syncInProgress = true;
    this.syncLibraries(libraries);

    return true;
  }

  isIntegrationValid(library: LikeLibrary) {
    const libraryImpl = this.libraries[library];
    if (!libraryImpl) {
      return false;
    }

    return libraryImpl.isIntegrationValid();
  }

  clear() {
    this.libraryQueue.kill();
    this.metadataQueue.kill();
    this.emitSyncEvent({
      action: "cancelled",
    });
    this.reset();
  }
}
