import { Injectable } from "@nestjs/common";

import { ExternalGameSource } from "@stakload/contracts/database/games";

import { Logger } from "../logging/logging.service";
import { fetchGameMetadata } from "./fetch-game-metadata";
import { getStakloadApiBaseUrl } from "./get-base-url";

@Injectable()
export class StakloadApiClient {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  async getGameMetadata(gameId: string, source: ExternalGameSource) {
    this.logger.debug("Processing game metadata request", { gameId, source });
    try {
      const metadata = await fetchGameMetadata(getStakloadApiBaseUrl(), gameId, source);
      if (metadata === null) {
        this.logger.warn("Game metadata not found", { gameId, source });
      }
      return metadata;
    } catch (error: unknown) {
      this.logger.error("Failed to get game metadata", {
        gameId,
        source,
        statusText: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}
