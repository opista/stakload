import { Library } from "@contracts/database/games";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

const BASE_URL = import.meta.env.MAIN_VITE_TRULAUNCH_API_URL;

@Service()
export class TrulaunchApiClient {
  constructor(private readonly logger: LoggerService) {}

  async getGameMetadata(gameId: string, library: Library) {
    this.logger.debug("Processing game metadata request", { gameId, library });
    const response = await fetch(`${BASE_URL}/games/${gameId}?library=${library}`);

    if (response.status === 200) {
      /**
       * TODO - revisit this. The API contract
       * should be shared. Move trulaunch-api into
       * this repo and convert to monorepo
       */
      const parsed = await response.json();

      return parsed;
    }

    if (response.status === 404) {
      this.logger.warn("Game metadata not found", { gameId, library });
      return null;
    }

    this.logger.error("Failed to get game metadata", {
      gameId,
      library,
      status: response.status,
      statusText: response.statusText,
    });
    throw new Error(response.statusText);
  }
}
