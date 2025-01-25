import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";

const STEAM_LAUNCHER_BASE_URL = "steam://";

// TODO - What happens if the command fails? We should look at handling
// this and returning an error in the UI about the launcher not being
// installed
export const launchSteamGame = async (game: GameStoreModel) =>
  shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}run/${game.gameId}`);

export const installSteamGame = async (game: GameStoreModel) =>
  shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}install/${game.gameId}`);

export const uninstallSteamGame = async (game: GameStoreModel) =>
  shell.openExternal(`${STEAM_LAUNCHER_BASE_URL}uninstall/${game.gameId}`);
