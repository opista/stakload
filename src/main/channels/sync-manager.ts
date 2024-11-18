import { IpcMainEvent, WebContents } from "electron";
import fastq from "fastq";
import { METADATA_SYNC_COMPLETE, METADATA_SYNC_INSERTED, METADATA_SYNC_PROCESSED } from "../../preload/channels";
import { getAppDetails } from "../libraries/steam";

export const syncManager = (contents: WebContents) => {
  const worker = async (game) => {
    const appDetails = await getAppDetails(game.gameId);
    contents.send(METADATA_SYNC_PROCESSED, { id: game.id, appDetails });
    if (!syncQueue.length()) {
      contents.send(METADATA_SYNC_COMPLETE);
    }
  };

  const syncQueue = fastq.promise(worker, 1);

  return async (_event: IpcMainEvent, gameIds: string[]) => {
    contents.send(METADATA_SYNC_INSERTED, gameIds.length);
    await Promise.all(gameIds.map((gameId) => syncQueue.push(gameId)));
  };
};
