import { GameStoreModel, Library, LikeLibrary } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/sync";
import { WebContents } from "electron";
import { Conf } from "electron-conf/main";
import fastq from "fastq";

import { EVENT_GAME_SYNC_STATUS } from "../../preload/channels";
import { bulkInsertGames, findUnsyncedGames, updateGameByGameId, updateGameById } from "../database/games";
import { SteamLibrary } from "../libraries/steam";
import { LibraryActions } from "../libraries/types";

interface SyncHistoryEntry {
  action: "library" | "install" | "metadata" | "complete";
  details?: {
    count?: number;
    errorCode?: "AUTHENTICATION_ERROR" | "UNSUPPORTED_LIBRARY" | "GAME_NOT_FOUND";
    gameName?: string;
  };
  library?: LikeLibrary;
  status: "success" | "failed";
  timestamp: Date;
}

export class GameSyncManager {
  private libraryQueue = fastq.promise(this.libraryWorker.bind(this), 1);
  private metadataQueue = fastq.promise(this.metadataWorker.bind(this), 3);
  private history: SyncHistoryEntry[] = [];
  private libraries: Partial<Record<Library, LibraryActions>>;
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
    this.webContents.send(EVENT_GAME_SYNC_STATUS, message);
  }

  private addHistoryEntry(entry: Omit<SyncHistoryEntry, "timestamp">) {
    const historyEntry = {
      ...entry,
      timestamp: new Date(),
    };
    this.history.push(historyEntry);

    switch (entry.action) {
      case "complete":
        this.emitSyncEvent({
          action: "complete",
          processed: this.processing,
          total: this.total,
        });
        break;
      case "library":
        this.emitSyncEvent({
          action: "library",
          library: entry.library!,
        });
        break;
      case "metadata":
        this.emitSyncEvent({
          action: "metadata",
          processing: this.processing,
          total: this.total,
        });
        break;
    }
  }

  private async libraryWorker(library: LikeLibrary) {
    const libraryImpl = this.libraries[library];
    if (!libraryImpl) {
      this.addHistoryEntry({
        action: "library",
        details: { errorCode: "UNSUPPORTED_LIBRARY" },
        library,
        status: "failed",
      });
      return;
    }

    try {
      const newGames = await libraryImpl.getNewGames();
      this.total += newGames.length;
      await bulkInsertGames(newGames);

      this.addHistoryEntry({
        action: "library",
        details: { count: newGames.length },
        library,
        status: "success",
      });

      const installedGames = await libraryImpl.getInstalledGames();
      await Promise.all(
        installedGames.map((data) =>
          updateGameByGameId(data.gameId, {
            installationDetails: data.installationDetails,
            isInstalled: true,
          }),
        ),
      );

      this.addHistoryEntry({
        action: "install",
        details: { count: installedGames.length },
        library,
        status: "success",
      });
    } catch (error) {
      this.addHistoryEntry({
        action: "library",
        details: { errorCode: "AUTHENTICATION_ERROR" },
        library,
        status: "failed",
      });
    }
  }

  private async metadataWorker(game: GameStoreModel) {
    this.processing++;

    const libraryImpl = this.libraries[game.library];

    if (!libraryImpl) {
      this.addHistoryEntry({
        action: "metadata",
        details: { errorCode: "UNSUPPORTED_LIBRARY", gameName: game.name },
        status: "failed",
      });
      return;
    }

    const metadata = await libraryImpl.getGameMetadata(game);
    await updateGameById(game._id, { ...metadata, metadataSyncedAt: new Date() });

    this.addHistoryEntry({
      action: "metadata",
      details: { gameName: game.name },
      status: "success",
    });
  }

  private async syncLibraries(libraries: LikeLibrary[]) {
    await Promise.all(libraries.map((library) => this.libraryQueue.push(library)));
    await this.libraryQueue.drained();

    const unsyncedGames = await findUnsyncedGames();
    await Promise.all(unsyncedGames.map((game) => this.metadataQueue.push(game)));
    await this.metadataQueue.drained();

    this.addHistoryEntry({
      action: "complete",
      status: "success",
    });
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
}
