import { GameFilters, GameStoreModel } from "@contracts/database/games";
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

    const games = await this.gameStore.findFilteredGames({}, "all");

    const uniqueValuesMap: { [key: string]: Map<string, string> } = filterableFields.reduce((acc, field) => {
      acc[field] = new Map();
      return acc;
    }, {});

    const isIdAndName = (item: unknown): item is { id: string; name: string } => {
      return typeof item === "object" && item !== null && "id" in item && "name" in item;
    };

    for (const document of games) {
      for (const field of filterableFields) {
        const items = document[field];
        if (Array.isArray(items)) {
          for (const item of items) {
            if (isIdAndName(item)) {
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

  async getGameById(id: string) {
    return await this.gameStore.findGameById(id);
  }

  async archiveGame(id: string) {
    return await this.gameStore.updateGameById(id, { archivedAt: new Date() });
  }

  async deleteGame(id: string) {
    return await this.gameStore.removeGameById(id);
  }

  async getProtondbTier(gameId: string) {
    return getProtondbTier(gameId);
  }

  getGamesList() {
    return this.gameStore.findFilteredGames({}, "list");
  }

  getQuickLaunchGames() {
    return this.gameStore.findFilteredGames({ isQuickLaunch: true }, "list");
  }

  getNewGames() {
    return this.gameStore.findFilteredGames({ createdAt: { dateRange: "ONE_WEEK" } }, "featured", {
      field: "createdAt",
      direction: -1,
    });
  }

  getFilteredGames(filters: GameFilters) {
    return this.gameStore.findFilteredGames(filters, "list");
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
