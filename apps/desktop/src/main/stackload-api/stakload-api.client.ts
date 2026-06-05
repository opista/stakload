import { Injectable } from "@nestjs/common";

import { GameMetadataSource } from "@stakload/contracts/database/games";

import { Logger } from "../logging/logging.service";
import { fetchGamesMetadata } from "./fetch-games-metadata";
import { getStakloadApiBaseUrl } from "./get-base-url";

@Injectable()
export class StakloadApiClient {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  async getGamesMetadata(source: GameMetadataSource, externalGameIds: string[]) {
    this.logger.debug("Processing games metadata request", {
      count: externalGameIds.length,
      source,
    });
    try {
      return await fetchGamesMetadata(getStakloadApiBaseUrl(), source, externalGameIds);
    } catch (error: unknown) {
      this.logger.error("Failed to get games metadata", {
        count: externalGameIds.length,
        source,
        statusText: error instanceof Error ? error.message : "Unknown error",
      });
      throw error;
    }
  }
}
