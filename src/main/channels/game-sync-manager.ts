import { GameStoreModel, LikeLibrary } from "@contracts/database/games";
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
import { findUnsyncedGames, updateGameByGameId, updateGameById } from "../database/games";
import { graphqlGetGameId } from "../libraries/epic-games/api";
import { findAndInsertNewGames as findAndInsertEpicGames } from "../libraries/epic-games/integration";
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
      await updateGameByGameId(gameId, { ...parsed, metadataSyncedAt: new Date() });
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
    const config = this.conf.get("library_settings.state.steamIntegration") as SteamIntegrationDetails;
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
