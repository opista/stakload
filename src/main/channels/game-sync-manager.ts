/* eslint-disable no-case-declarations */
import { GameStoreModel, InitialGameStoreModel, LikeLibrary } from "@contracts/database/games";
import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { GameSyncMessage } from "@contracts/store/game";
import { WebContents } from "electron";
import { Conf } from "electron-conf/main";
import fastq from "fastq";

import {
  EVENT_GAMES_LIST_UPDATED,
  EVENT_METADATA_SYNC_COMPLETE,
  EVENT_METADATA_SYNC_INSERTED,
  EVENT_METADATA_SYNC_PROCESSED,
  EVENT_METADATA_SYNC_SKIPPED,
  EVENT_SYNC_QUEUE_CLEARED,
} from "../../preload/channels";
import { bulkInsertGames, findUnsyncedGames, updateGameByGameId, updateGameById } from "../database/games";
import { graphqlGetGameId } from "../libraries/epic-games/api";
import { findAndInsertNewGames as findAndInsertEpicGames } from "../libraries/epic-games/integration";
import steamLibrary from "../libraries/steam";
import { findAndInsertNewGames as findAndInsertSteamGames } from "../libraries/steam/integration";
import { decryptString } from "../util/safe-storage";

export class GameSyncManager {
  private syncQueue = fastq.promise((game: GameStoreModel) => this.worker(game), 1);
  private processing: number = 0;
  private total: number = 0;

  constructor(
    private webContents: WebContents,
    private conf: Conf,
  ) {}

  async updateMetadata(gameId: string, library: LikeLibrary) {
    const response = await fetch(`${import.meta.env.MAIN_VITE_TRULAUNCH_API_URL}/games/${gameId}?library=${library}`);

    if (response.status === 200) {
      const parsed = await response.json();
      /**
       * TODO - revisit this. The API contract
       * should be shared. Move trulaunch-api into
       * this repo and convert to monorepo
       */

      const { icon, ...rest } = parsed;

      await updateGameByGameId(gameId, {
        ...rest,
        ...(library !== "steam" && { icon }),
        metadataSyncedAt: new Date(),
      });
      this.sendMessage(EVENT_METADATA_SYNC_PROCESSED);
    } else if (response.status === 404) {
      await updateGameByGameId(gameId, { metadataSyncedAt: new Date() });
      this.sendMessage(EVENT_METADATA_SYNC_PROCESSED);
    } else {
      this.sendMessage(EVENT_METADATA_SYNC_SKIPPED);
    }
  }

  /**
   * TODO - Major tidy up required here
   */

  async epicWorker(game: GameStoreModel) {
    if (game.gameId) {
      return this.updateMetadata(game.gameId, "epic-game-store");
    }

    const gameId = await graphqlGetGameId(game.libraryMeta!.namespace);
    if (!gameId) {
      await updateGameById(game._id, { metadataSyncedAt: new Date() });
      this.sendMessage(EVENT_METADATA_SYNC_PROCESSED);
      return;
    }

    await updateGameById(game._id, { gameId });
    return this.updateMetadata(gameId, "epic-game-store");
  }

  async steamWorker(game: GameStoreModel) {
    await this.updateMetadata(game.gameId!, "steam");
  }

  async worker(game: GameStoreModel) {
    this.processing += 1;

    switch (game.library) {
      case "steam":
        await this.updateMetadata(game.gameId!, "steam");
        break;
      case "epic-game-store":
        await this.epicWorker(game);
        break;
    }

    if (!this.syncQueue.length()) {
      this.sendMessage(EVENT_METADATA_SYNC_COMPLETE);
      this.processing = 0;
      this.total = 0;
    }
  }

  async sync() {
    const config = this.conf.get("integration_settings.state.steamIntegration") as SteamIntegrationDetails;
    const decrypedApiKey = decryptString(config.webApiKey);

    await findAndInsertSteamGames(config.steamId, decrypedApiKey);
    await findAndInsertEpicGames();
    this.sendMessage(EVENT_GAMES_LIST_UPDATED);
    const games = await findUnsyncedGames();
    this.total += games.length;

    if (games?.length) {
      this.sendMessage(EVENT_METADATA_SYNC_INSERTED);
      await Promise.all(games.map((game) => this.syncQueue.push(game)));
    }
  }

  sendMessage(channel: string) {
    const data: GameSyncMessage = { processing: this.processing, total: this.total };
    this.webContents.send(channel, data);
  }

  clear() {
    this.syncQueue.kill();
    this.sendMessage(EVENT_SYNC_QUEUE_CLEARED);
    this.processing = 0;
    this.total = 0;
  }
}

export type LibraryActions = {
  getGameMetadata: (game: GameStoreModel) => Promise<void>;
  getLibraryInstallationStates: () => Promise<void>;
  getNewGames: (conf: Conf) => Promise<InitialGameStoreModel[]>;
};

const epic: LibraryActions = {
  getGameMetadata: () => Promise.resolve(),
  getLibraryInstallationStates: () => Promise.resolve(),
  getNewGames: () => Promise.resolve([]),
};

// Probably stick this into the manager class for easy access and emitting events, tracking game sync count etc.
const libraryWorker = async (library: LikeLibrary) => {
  // TODO: Revisit this later, don't use a switch statement
  const conf = "conf" as unknown as Conf;
  switch (library) {
    case "steam":
      // TODO: Figure out translation - may need to pass key to frontend
      emitSyncEvent("Syncing Steam games", { type: "info" });
      const newGames = await steamLibrary.getNewGames(conf);
      await bulkInsertGames(newGames);
      await steamLibrary.getLibraryInstallationStates();
      break;
    case "epic-game-store":
      emitSyncEvent("Syncing Epic games", { type: "info" });
      const newGames = await epic.getNewGames(conf);
      await bulkInsertGames(newGames);
      await epic.getLibraryInstallationStates();
      break;
  }
};

const metadataWorker = async (game: GameStoreModel) => {
  emitSyncEvent("Syncing metadata", { type: "info" });

  // TODO: Revisit this later, don't use a switch statement
  switch (game.library) {
    case "steam":
      const metadata = await steamLibrary.getGameMetadata(game);
      await updateGameById(game._id, metadata);
      break;
    case "epic-game-store":
      const metadata = await epic.getGameMetadata(game);
      await updateGameById(game._id, metadata);
      break;
  }

  // TODO - Update metadata in database
};

const emitSyncEvent = (message: string, { type }: { type: "error" | "success" | "info" }) => {
  // TODO: Implement this
  console.log(type, message);
};

const libraryQueue = fastq.promise(libraryWorker, 1);
const metadataQueue = fastq.promise(metadataWorker, 3);

let syncInProgress = false;

export const syncLibraries = async (libraries: LikeLibrary[]) => {
  if (syncInProgress) {
    emitSyncEvent("A sync is already in progress.", { type: "error" });
    return;
  }

  syncInProgress = true;
  emitSyncEvent("Sync started", { type: "info" });

  await Promise.all(libraries.map((library) => libraryQueue.push(library)));
  await libraryQueue.drained();

  const unsyncedGames = await findUnsyncedGames();
  await Promise.all(unsyncedGames.map((game) => metadataQueue.push(game)));
  await metadataQueue.drained();

  emitSyncEvent("Sync complete", { type: "success" });
  syncInProgress = false;
};

export const syncLibrary = (library: LikeLibrary) => libraryQueue.push(library);
