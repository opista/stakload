import fastq from "fastq";
import { WebContents } from "electron";
import {
  EVENT_GAMES_LIST_UPDATED,
  EVENT_METADATA_SYNC_COMPLETE,
  EVENT_METADATA_SYNC_INSERTED,
  EVENT_METADATA_SYNC_PROCESSED,
} from "../../preload/channels";
import { findUnsyncedGames } from "../database/games";
import { Conf } from "electron-conf/main";
import { decryptString } from "../util/safe-storage";
import { findAndInsertNewGames } from "../libraries/steam/integration";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
export class GameSyncManager {
  private syncQueue = fastq.promise((gameId: string) => this.worker(gameId), 1);

  constructor(
    private webContents: WebContents,
    private conf: Conf,
  ) {}

  async worker(gameId) {
    /**
     * Disable for now until IGDB
     * API is set up
     */
    // const appDetails = await getAppDetails(gameId);
    // if (appDetails) {
    //   // TODO - proper handling
    //   await updateGameByGameId(gameId, mapAppDetailsToGameStoreModel(appDetails));
    // }
    await sleep(1000);
    this.webContents.send(EVENT_METADATA_SYNC_PROCESSED, { id: gameId });
    if (!this.syncQueue.length()) {
      this.webContents.send(EVENT_METADATA_SYNC_COMPLETE);
    }
  }

  async sync() {
    /**
     * TODO - Share state contract?
     */
    const config = this.conf.get("library_settings.state.steamIntegration") as { steamId: string; webApiKey: string };
    const decrypedApiKey = decryptString(config.webApiKey);

    await findAndInsertNewGames(config.steamId, decrypedApiKey);
    this.webContents.send(EVENT_GAMES_LIST_UPDATED);
    const games = await findUnsyncedGames();
    const gameIds = games.map(({ gameId }) => gameId);
    this.webContents.send(EVENT_METADATA_SYNC_INSERTED, gameIds.length);
    await Promise.all(gameIds.map((gameId) => this.syncQueue.push(gameId)));
  }

  clear() {
    return this.syncQueue.kill();
  }
}
