import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { WebContents } from "electron";
import { Conf } from "electron-conf/main";
import fastq from "fastq";

import {
  EVENT_GAMES_LIST_UPDATED,
  EVENT_METADATA_SYNC_COMPLETE,
  EVENT_METADATA_SYNC_INSERTED,
  EVENT_METADATA_SYNC_PROCESSED,
  EVENT_SYNC_QUEUE_CLEARED,
} from "../../preload/channels";
import { findUnsyncedGames, updateGameByGameId } from "../database/games";
import { findAndInsertNewGames } from "../libraries/steam/integration";
import { decryptString } from "../util/safe-storage";
export class GameSyncManager {
  private syncQueue = fastq.promise((gameId: string) => this.worker(gameId), 1);

  constructor(
    private webContents: WebContents,
    private conf: Conf,
  ) {}

  async worker(gameId) {
    /**
     * TODO - clear queue when window closes
     * Set API URL from env var
     */
    const response = await fetch(`http://localhost:3000/games/${gameId}`);

    if (response.status === 200) {
      const parsed = await response.json();
      /**
       * TOSO - revisit this. The API contract
       * should be shared. Move trulaunch-api into
       * this repo and convert to monorepo
       */
      await updateGameByGameId(gameId, { ...parsed, metadataSyncedAt: new Date() });
    }

    this.webContents.send(EVENT_METADATA_SYNC_PROCESSED, { id: gameId });
    if (!this.syncQueue.length()) {
      this.webContents.send(EVENT_METADATA_SYNC_COMPLETE);
    }
  }

  async sync() {
    const config = this.conf.get("library_settings.state.steamIntegration") as SteamIntegrationDetails;
    const decrypedApiKey = decryptString(config.webApiKey);

    await findAndInsertNewGames(config.steamId, decrypedApiKey);
    this.webContents.send(EVENT_GAMES_LIST_UPDATED);
    const games = await findUnsyncedGames();
    const gameIds = games.map(({ gameId }) => gameId);
    this.webContents.send(EVENT_METADATA_SYNC_INSERTED, gameIds.length);
    await Promise.all(gameIds.map((gameId) => this.syncQueue.push(gameId)));
  }

  clear() {
    this.syncQueue.kill();
    this.webContents.send(EVENT_SYNC_QUEUE_CLEARED);
  }
}
