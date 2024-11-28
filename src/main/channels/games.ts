import { IpcMainInvokeEvent, WebContents } from "electron";
import { findGameById, findLastSyncedAt, getFilteredGames, removeGameById } from "../database/games";
import { EVENT_GAMES_LIST_UPDATED } from "../../preload/channels";

export const getFilteredGameLibrary = () => {
  // TODO

  return getFilteredGames();
};

export const getGameById = (_event: IpcMainInvokeEvent, id: string) => findGameById(id);

export const getGamesLastSyncedAt = (_event: IpcMainInvokeEvent) => findLastSyncedAt();

export const removeGame =
  (contents: WebContents) => async (_event: IpcMainInvokeEvent, id: string, preventReadd: boolean) => {
    await removeGameById(id, preventReadd);
    contents.send(EVENT_GAMES_LIST_UPDATED);
  };
