import { GameStoreModel, Library } from "@contracts/database/games";

import { fetchGameMetadata } from "../../api/trulaunch";
import {
  bulkInsertGames,
  findGamesByEpicNamespace,
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

    if (installedGames.length === 0) {
      return;
    }

    await Promise.all(
      installedGames.map(({ appName, installationDetails }) =>
        updateGameByEpicAppName(appName, { installationDetails, isInstalled: true }),
      ),
    );
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
