import { GameStoreModel, LikeLibrary } from "@contracts/database/games";

import { installEpicGame, launchEpicGame, uninstallEpicGame } from "./epic";
import { installSteamGame, launchSteamGame, uninstallSteamGame } from "./steam";

type LauncherFunctionMap = {
  install: (game: GameStoreModel) => Promise<void>;
  launch: (game: GameStoreModel) => Promise<void>;
  uninstall: (game: GameStoreModel) => Promise<void>;
};

const launchers: Partial<Record<LikeLibrary, LauncherFunctionMap>> = {
  "epic-game-store": {
    install: installEpicGame,
    launch: launchEpicGame,
    uninstall: uninstallEpicGame,
  },
  steam: {
    install: installSteamGame,
    launch: launchSteamGame,
    uninstall: uninstallSteamGame,
  },
};

const getLauncher = (library: LikeLibrary) => {
  const launcher = launchers[library];

  if (!launcher) {
    throw new Error(`Unsupported game library: ${library}`);
  }

  return launcher;
};

export const launchGame = (game: GameStoreModel) => getLauncher(game.library).launch(game);

export const installGame = (game: GameStoreModel) => getLauncher(game.library).install(game);

export const uninstallGame = (game: GameStoreModel) => getLauncher(game.library).uninstall(game);
