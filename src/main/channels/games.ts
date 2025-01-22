import { IpcMainInvokeEvent, WebContents } from "electron";

import { EVENT_GAMES_LIST_UPDATED } from "../../preload/channels";
import { findCollectionById } from "../database/collections";
import {
  findGameById,
  findGameFilters,
  findLastSyncedAt,
  getFilteredGames,
  getGamesList,
  getNewGames,
  getQuickLaunchGames,
  removeGameById,
  toggleQuickLaunchGame,
} from "../database/games";

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

export const getGamesListHandler = (_event: IpcMainInvokeEvent) => getGamesList();

export const getQuickLaunchGamesHandler = (_event: IpcMainInvokeEvent) => getQuickLaunchGames();

export const getNewGamesHandler = (_event: IpcMainInvokeEvent) => getNewGames();

export const getCollectionGamesHandler = async (_event: IpcMainInvokeEvent, id: string) => {
  const collection = await findCollectionById(id);
  if (!collection) return [];
  return getFilteredGames(collection.filters);
};

export const toggleQuickLaunchGameHandler =
  (contents: WebContents) => async (_event: IpcMainInvokeEvent, id: string) => {
    const updated = await toggleQuickLaunchGame(id);
    contents.send(EVENT_GAMES_LIST_UPDATED);
    return updated;
  };
