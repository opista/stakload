import { Injectable } from "@nestjs/common";

import { buildQueryParams } from "@util/build-query-params";

import { Logger } from "../../../logging/logging.service";
import { OwnedGamesResponse } from "./types";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

@Injectable()
export class SteamApiService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  async getOwnedGames(key: string, steamid: string) {
    this.logger.debug("Fetching owned games from Steam API", { steamid });
    try {
      const query = buildQueryParams({
        include_appinfo: "true",
        include_played_free_games: "true",
        key,
        steamid,
      });
      const response = await fetch(`${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v1${query}`, {
        headers: { accept: "application/json" },
        method: "GET",
      });

      const parsed: OwnedGamesResponse = await response.json();
      this.logger.debug("Fetched owned games from Steam API", {
        gameCount: parsed?.response?.game_count,
      });
      return parsed?.response?.games;
    } catch (err) {
      const message = "Request to Steam API failed";
      this.logger.error(message, err);
      throw new Error(message);
    }
  }
}
