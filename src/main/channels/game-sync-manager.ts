import fastq from "fastq";
import { WebContents } from "electron";
import { METADATA_SYNC_COMPLETE, METADATA_SYNC_INSERTED, METADATA_SYNC_PROCESSED } from "../../preload/channels";
import { findUnsyncedGames } from "../database/games";
import { Conf } from "electron-conf/main";
import { decryptString } from "../util/safe-storage";
import { findAndInsertNewGames } from "../libraries/steam/integration";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const gameSyncManager = (contents: WebContents, conf: Conf) => {
  const worker = async (gameId) => {
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
    contents.send(METADATA_SYNC_PROCESSED, { id: gameId });
    if (!syncQueue.length()) {
      contents.send(METADATA_SYNC_COMPLETE);
    }
  };

  const syncQueue = fastq.promise(worker, 1);

  const syncGames = async () => {
    /**
     * TODO - Share state type?
     */
    const config = conf.get("library_settings.state.steamIntegration") as { steamId: string; webApiKey: string };
    const decrypedApiKey = decryptString(config.webApiKey);

    await findAndInsertNewGames(config.steamId, decrypedApiKey);
    const games = await findUnsyncedGames();
    const gameIds = games.map(({ gameId }) => gameId);
    contents.send(METADATA_SYNC_INSERTED, gameIds.length);
    await Promise.all(gameIds.map((gameId) => syncQueue.push(gameId)));
  };

  return { syncGames };
};
