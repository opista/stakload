import { GameStoreModel, Library } from "@contracts/database/games";

import { fetchGameMetadata } from "../../api/trulaunch";
import {
  bulkInsertGames,
  findGamesByEpicNamespace,
  getInstalledGames,
  updateGameByEpicAppName,
  updateGameById,
} from "../../database/games";
import { LibraryActions } from "../types";
import { graphqlGetGameId } from "./api";
import { createInstallationStrategy } from "./installation/create-installation-strategy";
import type { InstallationStrategy } from "./installation/types";
import { getOwnedGames } from "./legendary";
import { mapOwnedGameToGameStoreModel } from "./mappers/map-owned-game-to-game-store-model";

export class EpicGamesStoreLibrary implements LibraryActions {
  private library = Library.EpicGameStore;
  private installationStrategy: InstallationStrategy;

  constructor() {
    this.installationStrategy = createInstallationStrategy();
  }

  async getGameMetadata(game: GameStoreModel): Promise<GameStoreModel | null> {
    if (game.gameId) {
      return await fetchGameMetadata(game.gameId, this.library);
    }

    const gameId = await graphqlGetGameId(game.libraryMeta!.namespace);

    if (!gameId) {
      return null;
    }

    await updateGameById(game._id, { gameId });
    return await fetchGameMetadata(gameId, this.library);
  }

  async updateInstalledGames() {
    const installedGames = await this.installationStrategy.getInstalledGames();
    const installedGameAppNames = installedGames.map((game) => game.appName);

    const currentlyInstalledGames = await getInstalledGames(this.library);
    const uninstalledAppNames = currentlyInstalledGames
      .map((game) => game.libraryMeta?.appName)
      .filter((appName): appName is string => !!appName && !installedGameAppNames.includes(appName));

    const gamesToMarkUninstalled = uninstalledAppNames.map((appName) =>
      updateGameByEpicAppName(appName, { installationDetails: undefined, isInstalled: false }),
    );

    const gamesToMarkInstalled = installedGames.map(({ appName, installationDetails }) =>
      updateGameByEpicAppName(appName, { installationDetails, isInstalled: true }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
  }

  async isIntegrationValid(): Promise<boolean> {
    return true;
  }

  async addNewGames() {
    const ownedGames = await getOwnedGames();
    const existingGames = await findGamesByEpicNamespace(ownedGames.map(({ metadata: { namespace } }) => namespace));
    const existingIds = existingGames.map(({ libraryMeta }) => libraryMeta?.namespace);

    const mappedGames = ownedGames
      .filter((game) => !existingIds.includes(game.metadata.namespace))
      .map((game) => mapOwnedGameToGameStoreModel(game));

    await bulkInsertGames(mappedGames);

    return mappedGames.length;
  }
}
