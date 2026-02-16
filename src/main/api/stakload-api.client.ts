import { ExternalGameSource, GameStoreModel } from "@contracts/database/games";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

const BASE_URL = import.meta.env.MAIN_VITE_STAKLOAD_API_URL;

@Service()
export class StakloadApiClient {
  constructor(private readonly logger: LoggerService) {}

  async getGameMetadata(gameId: string, source: ExternalGameSource) {
    this.logger.debug("Processing game metadata request", { gameId, source });
    const response = await fetch(`${BASE_URL}/games/${gameId}?source=${source}`);

    if (response.status === 200) {
      /**
       * TODO - revisit this. The API contract
       * should be shared. Move stakload-api into
       * this repo and convert to monorepo
       */
      const parsed: GameStoreModel = await response.json();

      return parsed;
    }

    if (response.status === 404) {
      this.logger.warn("Game metadata not found", { gameId, source });
      return null;
    }

    this.logger.error("Failed to get game metadata", {
      gameId,
      source,
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(response.statusText);
  }
}
