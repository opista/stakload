import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";

const STEAM_LAUNCHER_BASE_URL = "steam://";

export const launchSteamGame = async (game: GameStoreModel) =>
  shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}run/${game.gameId}`);

export const installSteamGame = async (game: GameStoreModel) =>
  shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}install/${game.gameId}`);

export const uninstallSteamGame = async (game: GameStoreModel) =>
  shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}uninstall/${game.gameId}`);
