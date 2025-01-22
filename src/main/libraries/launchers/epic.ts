import { GameStoreModel } from "@contracts/database/games";
import { shell } from "electron";

const EPIC_LAUNCHER_BASE_URL = "com.epicgames.launcher://";

export const launchEpicGame = async (game: GameStoreModel) =>
  await shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}apps/${game.libraryMeta?.appName}?action=launch&silent=true`);

export const installEpicGame = async (game: GameStoreModel) =>
  shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}apps/${game.libraryMeta?.appName}?action=install`);

// Unfortunately, Epic Games Launcher doesn't support uninstalling games in this way
export const uninstallEpicGame = async () => shell.openExternal(`${EPIC_LAUNCHER_BASE_URL}store/library`);
