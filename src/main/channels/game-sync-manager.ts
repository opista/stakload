import fastq from "fastq";
import { WebContents } from "electron";
import { METADATA_SYNC_COMPLETE, METADATA_SYNC_INSERTED, METADATA_SYNC_PROCESSED } from "../../preload/channels";
import { getAppDetails } from "../libraries/steam";
import { findUnsyncedGames, updateGameByGameId } from "../database/games";
import { mapAppDetailsToGameStoreModel } from "../libraries/steam/util/map-app-details-to-game-store-model";

export const gameSyncManager = (contents: WebContents) => {
  const worker = async (gameId) => {
    const appDetails = await getAppDetails(gameId);
    if (appDetails) {
      // TODO - proper handling
      await updateGameByGameId(gameId, mapAppDetailsToGameStoreModel(appDetails));
    }
    contents.send(METADATA_SYNC_PROCESSED, { id: gameId, appDetails });
    if (!syncQueue.length()) {
      contents.send(METADATA_SYNC_COMPLETE);
    }
  };

  const syncQueue = fastq.promise(worker, 1);

  const syncGames = async () => {
    const games = await findUnsyncedGames();
    const gameIds = games.map(({ gameId }) => gameId);
    contents.send(METADATA_SYNC_INSERTED, gameIds.length);
    await Promise.all(gameIds.map((gameId) => syncQueue.push(gameId)));
  };

  return { syncGames };
};
