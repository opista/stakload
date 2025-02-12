import { GameFilters, GameStoreModel } from "@contracts/database/games";
import { Service } from "typedi";

import { getProtondbTier } from "../api/protondb";
import { CollectionStore } from "../collection/collection.store";
import { LoggerService } from "../logger/logger.service";
import { GameStore } from "./game.store";

@Service()
export class GameService {
  constructor(
    private readonly collectionStore: CollectionStore,
    private readonly gameStore: GameStore,
    private readonly logger: LoggerService,
  ) {}

  async getGameFilters() {
    this.logger.debug("Processing game filters request");
    try {
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

      this.logger.info("Game filters retrieved successfully");
      return results;
    } catch (error) {
      this.logger.error("Failed to get game filters", error);
      throw error;
    }
  }

  async getGameById(id: string) {
    this.logger.debug("Processing game fetch by id", { id });
    try {
      const game = await this.gameStore.findGameById(id);
      if (!game) {
        this.logger.warn("Game not found", { id });
      } else {
        this.logger.info("Game retrieved successfully", { id });
      }
      return game;
    } catch (error) {
      this.logger.error("Failed to get game by id", error, { id });
      throw error;
    }
  }

  async archiveGame(id: string) {
    this.logger.debug("Processing game archive", { id });
    try {
      const result = await this.gameStore.updateGameById(id, { archivedAt: new Date() });
      if (result) {
        this.logger.info("Game archived successfully", { id });
      }
      return result;
    } catch (error) {
      this.logger.error("Failed to archive game", error, { id });
      throw error;
    }
  }

  async deleteGame(id: string) {
    this.logger.debug("Processing game deletion", { id });
    try {
      const result = await this.gameStore.removeGameById(id);
      if (result) {
        this.logger.info("Game deleted successfully", { id });
      }
      return result;
    } catch (error) {
      this.logger.error("Failed to delete game", error, { id });
      throw error;
    }
  }

  async getProtondbTier(gameId: string) {
    return getProtondbTier(gameId);
  }

  async getGamesList() {
    this.logger.debug("Processing games list request");
    try {
      const games = await this.gameStore.findFilteredGames({}, "list");
      this.logger.info("Games list retrieved successfully", { count: games.length });
      return games;
    } catch (error) {
      this.logger.error("Failed to get games list", error);
      throw error;
    }
  }

  async getQuickLaunchGames() {
    this.logger.debug("Processing quick launch games request");
    try {
      const games = await this.gameStore.findFilteredGames({ isQuickLaunch: true }, "list");
      this.logger.info("Quick launch games retrieved successfully", { count: games.length });
      return games;
    } catch (error) {
      this.logger.error("Failed to get quick launch games", error);
      throw error;
    }
  }

  async getNewGames() {
    this.logger.debug("Processing new games request");
    try {
      const games = await this.gameStore.findFilteredGames(
        { createdAt: { dateRange: "ONE_WEEK" } },
        "featured",
        {
          field: "createdAt",
          direction: -1,
        },
        10,
      );
      this.logger.info("New games retrieved successfully", { count: games.length });
      return games;
    } catch (error) {
      this.logger.error("Failed to get new games", error);
      throw error;
    }
  }

  async getFilteredGames(filters: GameFilters) {
    this.logger.debug("Processing filtered games request", { filters });
    try {
      const games = await this.gameStore.findFilteredGames(filters, "list");
      this.logger.info("Filtered games retrieved successfully", { count: games.length, filters });
      return games;
    } catch (error) {
      this.logger.error("Failed to get filtered games", error, { filters });
      throw error;
    }
  }

  async getGamesByCollectionId(id: string) {
    this.logger.debug("Processing games fetch by collection", { id });
    try {
      const collection = await this.collectionStore.findCollectionById(id);
      if (!collection) {
        this.logger.warn("Collection not found for games fetch", { id });
        return [];
      }
      const games = await this.gameStore.findFilteredGames(collection.filters, "list");
      this.logger.info("Games retrieved for collection", { id, count: games.length });
      return games;
    } catch (error) {
      this.logger.error("Failed to get games by collection", error, { id });
      throw error;
    }
  }

  async toggleFavouriteGame(id: string) {
    this.logger.debug("Processing favourite game toggle", { id });
    try {
      const result = await this.gameStore.toggleFavouriteGame(id);
      if (result) {
        this.logger.info("Game favourite status toggled successfully", { id });
      }
      return result;
    } catch (error) {
      this.logger.error("Failed to toggle game favourite status", error, { id });
      throw error;
    }
  }

  async toggleQuickLaunchGame(id: string) {
    this.logger.debug("Processing quick launch game toggle", { id });
    try {
      const result = await this.gameStore.toggleQuickLaunchGame(id);
      if (result) {
        this.logger.info("Game quick launch status toggled successfully", { id });
      }
      return result;
    } catch (error) {
      this.logger.error("Failed to toggle game quick launch status", error, { id });
      throw error;
    }
  }
}
