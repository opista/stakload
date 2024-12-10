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
import { findUnsyncedGames, updateGameByGameId } from "../database/games";
import { findAndInsertNewGames } from "../libraries/steam/integration";
import { decryptString } from "../util/safe-storage";
export class GameSyncManager {
  private syncQueue = fastq.promise((gameId: string) => this.worker(gameId), 1);
  private processing: number = 0;
  private total: number = 0;

  constructor(
    private webContents: WebContents,
    private conf: Conf,
  ) {}

  async worker(gameId) {
    this.processing += 1;

    const response = await fetch(`${import.meta.env.MAIN_VITE_TRULAUNCH_API_URL}/games/${gameId}`);

    if (response.status === 200) {
      const parsed = await response.json();
      /**
       * TOSO - revisit this. The API contract
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

    if (!this.syncQueue.length()) {
      this.sendMessage(EVENT_METADATA_SYNC_COMPLETE);
      this.processing = 0;
      this.total = 0;
    }
  }

  async sync() {
    const config = this.conf.get("library_settings.state.steamIntegration") as SteamIntegrationDetails;
    const decrypedApiKey = decryptString(config.webApiKey);

    await findAndInsertNewGames(config.steamId, decrypedApiKey);
    this.sendMessage(EVENT_GAMES_LIST_UPDATED);
    const games = await findUnsyncedGames();
    const gameIds = games.map(({ gameId }) => gameId);
    this.total += gameIds.length;

    if (gameIds?.length) {
      this.sendMessage(EVENT_METADATA_SYNC_INSERTED);
      await Promise.all(gameIds.map((gameId) => this.syncQueue.push(gameId)));
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
