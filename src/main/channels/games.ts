import { GameFilters } from "@contracts/database/games";
import { IpcMainInvokeEvent, WebContents } from "electron";

import { EVENT_GAMES_LIST_UPDATED } from "../../preload/channels";
import { findGameById, findGameFilters, findLastSyncedAt, getFilteredGames, removeGameById } from "../database/games";

export const getFilteredGameLibrary = (_event: IpcMainInvokeEvent, filters?: GameFilters) => getFilteredGames(filters);

export const getGameFilters = (_event: IpcMainInvokeEvent) => findGameFilters();

export const getGameById = (_event: IpcMainInvokeEvent, id: string) => findGameById(id);

export const getGamesLastSyncedAt = (_event: IpcMainInvokeEvent) => findLastSyncedAt();

export const removeGame =
  (contents: WebContents) => async (_event: IpcMainInvokeEvent, id: string, preventReadd: boolean) => {
    await removeGameById(id, preventReadd);
    contents.send(EVENT_GAMES_LIST_UPDATED);
  };

export const getProtondbTier = async (_event: IpcMainInvokeEvent, gameId: string) => {
  try {
    const response = await fetch(`https://www.protondb.com/api/v1/reports/summaries/${gameId}.json`);
    const parsed = await response.json();
    return parsed.tier;
  } catch (err) {
    // TODO - Logging
    return null;
  }
};
