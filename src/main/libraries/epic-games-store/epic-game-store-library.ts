import { GameStoreModel, Library } from "@contracts/database/games";

import { fetchGameMetadata } from "../../api/trulaunch";
import { GameStore } from "../../game/game.store";
import { LibraryActions } from "../../sync/types";
import { graphqlGetGameId } from "./api";
import { createInstallationStrategy } from "./installation/create-installation-strategy";
import type { InstallationStrategy } from "./installation/types";
import { getOwnedGames } from "./legendary";
import { mapOwnedGameToGameStoreModel } from "./mappers/map-owned-game-to-game-store-model";

export class EpicGamesStoreLibrary implements LibraryActions {
  private library = Library.EpicGameStore;
  private installationStrategy: InstallationStrategy;

  constructor(private readonly gameStore: GameStore) {
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

    await this.gameStore.updateGameById(game._id, { gameId });
    return await fetchGameMetadata(gameId, this.library);
  }

  async updateInstalledGames() {
    const installedGames = await this.installationStrategy.getInstalledGames();
    const installedGameAppNames = installedGames.map((game) => game.appName);

    const currentlyInstalledGames = await this.gameStore.findFilteredGames<GameStoreModel>(
      {
        isInstalled: true,
        libraries: [this.library],
      },
      "all",
    );
    const uninstalledAppNames = currentlyInstalledGames
      .map((game) => game.libraryMeta?.appName)
      .filter((appName): appName is string => !!appName && !installedGameAppNames.includes(appName));

    const gamesToMarkUninstalled = uninstalledAppNames.map((appName) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails: undefined, isInstalled: false }),
    );

    const gamesToMarkInstalled = installedGames.map(({ appName, installationDetails }) =>
      this.gameStore.updateGameByEpicAppName(appName, { installationDetails, isInstalled: true }),
    );

    await Promise.all([...gamesToMarkUninstalled, ...gamesToMarkInstalled]);
  }

  async isIntegrationValid(): Promise<boolean> {
    return true;
  }

  async addNewGames() {
    const ownedGames = await getOwnedGames();
    const existingGames = await this.gameStore.findGamesByEpicNamespace(
      ownedGames.map(({ metadata: { namespace } }) => namespace),
    );
    const existingIds = existingGames.map(({ libraryMeta }) => libraryMeta?.namespace);

    const mappedGames = ownedGames
      .filter((game) => !existingIds.includes(game.metadata.namespace))
      .map((game) => mapOwnedGameToGameStoreModel(game));

    await this.gameStore.bulkInsertGames(mappedGames);

    return mappedGames.length;
  }
}
