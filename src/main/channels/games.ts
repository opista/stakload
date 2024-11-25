import { IpcMainInvokeEvent } from "electron";
import { findGameById, getFilteredGames } from "../database/games";

export const getFilteredGameLibrary = () => {
  // TODO

  return getFilteredGames();
};

export const getGameById = (_event: IpcMainInvokeEvent, id: string) => findGameById(id);
