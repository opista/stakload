import { Injectable } from "@nestjs/common";

import { Logger } from "../../../logging/logging.service";
import { fetchOwnedGames } from "./fetch-owned-games";

@Injectable()
export class SteamApiService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  async getOwnedGames(key: string, steamid: string) {
    this.logger.debug("Fetching owned games from Steam API", { steamid });
    try {
      const parsed = await fetchOwnedGames(key, steamid);
      this.logger.debug("Fetched owned games from Steam API", {
        gameCount: parsed.length,
      });
      return parsed;
    } catch (err) {
      const message = "Request to Steam API failed";
      this.logger.error(message, err);
      throw new Error(message);
    }
  }
}
