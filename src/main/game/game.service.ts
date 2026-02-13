import { GameFilters, GameStoreModel } from "@contracts/database/games";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { ProtondbApiClient } from "../api/protondb-api.client";
import { CollectionStore } from "../collection/collection.store";
import { LoggerService } from "../logger/logger.service";
import { WindowService } from "../window/window.service";

import { GameStore } from "./game.store";
@Service()
export class GameService {
  constructor(
    private readonly collectionStore: CollectionStore,
    private readonly gameStore: GameStore,
    private readonly logger: LoggerService,
    private readonly protondbApiClient: ProtondbApiClient,
    private readonly windowService: WindowService,
  ) {}

  async archiveGame(id: string) {
    this.logger.debug("Processing game archive", { id });
    try {
      const result = await this.gameStore.updateGameById(id, { archivedAt: new Date() });
      if (result) {
        this.logger.info("Game archived successfully", { id });
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
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
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
      }
      return result;
    } catch (error) {
      this.logger.error("Failed to delete game", error, { id });
      throw error;
    }
  }

  async getFilteredGames(filters: GameFilters) {
    this.logger.debug("Processing filtered games request", { filters });
    try {
      const games = await this.gameStore.findFilteredGames(filters, "list");
      this.logger.debug("Filtered games retrieved successfully", { count: games.length, filters });
      return games;
    } catch (error) {
      this.logger.error("Failed to get filtered games", error, { filters });
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
        this.logger.debug("Game retrieved successfully", { id });
      }
      return game;
    } catch (error) {
      this.logger.error("Failed to get game by id", error, { id });
      throw error;
    }
  }

  async getGameFilters() {
    this.logger.debug("Processing game filters request");
    try {
      const filterableFields: (keyof GameStoreModel)[] = [
        "ageRatings",
        "developers",
        "gameModes",
        "genres",
        "platforms",
        "playerPerspectives",
        "publishers",
      ];

      const games = await this.gameStore.findFilteredGames({}, "all");

      const isIdAndName = (item: unknown): item is { id: string; name: string } =>
        typeof item === "object" && item !== null && "id" in item && "name" in item;

      const results = filterableFields.reduce(
        (acc, field) => {
          const values = games
            .flatMap((game) => (Array.isArray(game[field]) ? game[field] : []))
            .filter(isIdAndName)
            .reduce((map, { id, name }) => map.set(id, name), new Map<string, string>());

          acc[field] = Array.from(values.entries())
            .map(([id, name]) => ({ label: name, value: id }))
            .sort((a, b) => a.label.localeCompare(b.label));
          return acc;
        },
        {} as { [key in keyof GameStoreModel]?: { label: string; value: string }[] },
      );

      this.logger.debug("Game filters retrieved successfully");
      return results;
    } catch (error) {
      this.logger.error("Failed to get game filters", error);
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
      this.logger.debug("Games retrieved for collection", { count: games.length, id });
      return games;
    } catch (error) {
      this.logger.error("Failed to get games by collection", error, { id });
      throw error;
    }
  }

  async getGamesList() {
    this.logger.debug("Processing games list request");
    try {
      const games = await this.gameStore.findFilteredGames({}, "list");
      this.logger.debug("Games list retrieved successfully", { count: games.length });
      return games;
    } catch (error) {
      this.logger.error("Failed to get games list", error);
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
          direction: -1,
          field: "createdAt",
        },
        10,
      );
      this.logger.debug("New games retrieved successfully", { count: games.length });
      return games;
    } catch (error) {
      this.logger.error("Failed to get new games", error);
      throw error;
    }
  }

  async getProtondbTier(gameId: string) {
    this.logger.debug("Processing Protondb tier request", { gameId });
    return this.protondbApiClient.getTier(gameId);
  }

  async getQuickLaunchGames() {
    this.logger.debug("Processing quick launch games request");
    try {
      const games = await this.gameStore.findFilteredGames({ isQuickLaunch: true }, "list");
      this.logger.debug("Quick launch games retrieved successfully", { count: games.length });
      return games;
    } catch (error) {
      this.logger.error("Failed to get quick launch games", error);
      throw error;
    }
  }

  async toggleFavouriteGame(id: string) {
    this.logger.debug("Processing favourite game toggle", { id });
    try {
      const result = await this.gameStore.toggleFavouriteGame(id);
      if (result) {
        this.logger.info("Game favourite status toggled successfully", { id });
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
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
        this.windowService.sendEvent(EVENT_CHANNELS.GAMES_LIST_UPDATED);
      }
      return result;
    } catch (error) {
      this.logger.error("Failed to toggle game quick launch status", error, { id });
      throw error;
    }
  }
}
