import { IpcMainInvokeEvent } from "electron";
import { findGameById, findLastSyncedAt, getFilteredGames, removeGameById } from "../database/games";

export const getFilteredGameLibrary = () => {
  // TODO

  return getFilteredGames();
};

export const getGameById = (_event: IpcMainInvokeEvent, id: string) => findGameById(id);

export const getGamesLastSyncedAt = (_event: IpcMainInvokeEvent) => findLastSyncedAt();

export const removeGame = (_event: IpcMainInvokeEvent, id: string, preventReadd: boolean) =>
  removeGameById(id, preventReadd);
