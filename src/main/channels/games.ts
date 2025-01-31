import { GameFilters } from "@contracts/database/games";
import { BrowserWindow, IpcMainInvokeEvent, WebContents } from "electron";

import { EVENT_CHANNELS } from "../../preload/channels";
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
  toggleFavouriteGame,
  toggleQuickLaunchGame,
} from "../database/games";
import { installGame, uninstallGame } from "../libraries/launchers";
import { EnhancedSteamLauncher } from "../libraries/launchers/enhanced-steam";

const steamLauncher = new EnhancedSteamLauncher();

export const getGameFilters = (_event: IpcMainInvokeEvent) => findGameFilters();

export const getGameById = (_event: IpcMainInvokeEvent, id: string) => findGameById(id);

export const getGamesLastSyncedAt = (_event: IpcMainInvokeEvent) => findLastSyncedAt();

export const removeGame =
  (contents: WebContents) => async (_event: IpcMainInvokeEvent, id: string, preventReadd: boolean) => {
    await removeGameById(id, preventReadd);
    contents.send(EVENT_CHANNELS.GAMES_LIST_UPDATED);
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

export const toggleFavouriteGameHandler = (contents: WebContents) => async (_event: IpcMainInvokeEvent, id: string) => {
  const updated = await toggleFavouriteGame(id);
  contents.send(EVENT_CHANNELS.GAMES_LIST_UPDATED);
  return updated;
};

export const toggleQuickLaunchGameHandler =
  (contents: WebContents) => async (_event: IpcMainInvokeEvent, id: string) => {
    const updated = await toggleQuickLaunchGame(id);
    contents.send(EVENT_CHANNELS.GAMES_LIST_UPDATED);
    return updated;
  };

export const launchGameHandler = async (id: string, browserWindow: BrowserWindow) => {
  const game = await findGameById(id);
  if (!game) return;

  const result = await steamLauncher.launchGame(game);

  if (!result.success) {
    // browserWindow.webContents.send(EVENT_CHANNELS.GAME_LAUNCH_ERROR, {
    //   gameId: id,
    //   error: result.error,
    // });
    return;
  }

  // Minimize when game launches
  browserWindow.minimize();

  // Set up game exit handler
  steamLauncher.onGameExit(() => {
    browserWindow.restore();
    browserWindow.focus();
  });
};

export const installGameHandler = async (id: string) => {
  const game = await findGameById(id);
  // TODO - Proper handling
  if (!game) return;
  await installGame(game);
};

export const uninstallGameHandler = async (id: string) => {
  const game = await findGameById(id);
  // TODO - Proper handling
  if (!game) return;
  await uninstallGame(game);
};

export const getFilteredGamesHandler = (_event: IpcMainInvokeEvent, filters: GameFilters) => getFilteredGames(filters);
