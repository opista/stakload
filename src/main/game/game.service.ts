import { GameFilters, GameListModel, GameStoreModel } from "@contracts/database/games";
import { Service } from "typedi";

import { getProtondbTier } from "../api/protondb";
import { CollectionStore } from "../collection/collection.store";
import { GameStore } from "./game.store";

@Service()
export class GameService {
  constructor(
    private readonly collectionStore: CollectionStore,
    private readonly gameStore: GameStore,
  ) {}

  async getGameFilters() {
    const filterableFields: (keyof GameStoreModel)[] = [
      "developers",
      "gameModes",
      "genres",
      "platforms",
      "playerPerspectives",
      "publishers",
    ];

    const games = await this.gameStore.findFilteredGames();

    const uniqueValuesMap: { [key: string]: Map<string, string> } = filterableFields.reduce((acc, field) => {
      acc[field] = new Map();
      return acc;
    }, {});

    for (const document of games) {
      for (const field of filterableFields) {
        const items = document[field];
        if (Array.isArray(items)) {
          for (const item of items) {
            if (item.id && item.name) {
              // Use ID as the key for uniqueness
              uniqueValuesMap[field].set(item.id, item.name);
            }
          }
        }
      }
    }

    // TODO fix typing and look at cleaning this up

    const results = filterableFields.reduce((acc, field) => {
      acc[field] = Array.from(uniqueValuesMap[field].entries())
        .map(([id, name]) => ({
          label: name,
          value: id,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      return acc;
    }, {});

    return results;
  }

  getGameById(id: string) {
    return this.gameStore.findGameById(id);
  }

  async removeGame(id: string, preventReadd: boolean) {
    try {
      if (preventReadd) {
        await this.gameStore.updateGameById(id, { deletedAt: new Date() });
      } else {
        await this.gameStore.removeGameById(id);
      }
      // TODO - Better handling here?
      return true;
    } catch (err) {
      // TODO error logging
      return false;
    }
  }

  async getProtondbTier(gameId: string) {
    return getProtondbTier(gameId);
  }

  getGamesList() {
    return this.gameStore.findFilteredGames<GameListModel>({}, "list");
  }

  getQuickLaunchGames() {
    return this.gameStore.findFilteredGames<GameListModel>({ isQuickLaunch: true }, "list");
  }

  getNewGames() {
    return this.gameStore.getNewGames();
  }

  getFilteredGames(filters: GameFilters) {
    return this.gameStore.findFilteredGames<GameListModel>(filters, "list");
  }

  async getGamesByCollectionId(id: string) {
    const collection = await this.collectionStore.findCollectionById(id);
    if (!collection) return [];
    return this.gameStore.findFilteredGames(collection.filters, "list");
  }

  async toggleFavouriteGame(id: string) {
    return await this.gameStore.toggleFavouriteGame(id);
  }

  async toggleQuickLaunchGame(id: string) {
    return await this.gameStore.toggleQuickLaunchGame(id);
  }
}
