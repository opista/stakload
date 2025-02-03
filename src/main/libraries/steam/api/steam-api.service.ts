import { buildQueryParams } from "@util/build-query-params";
import { decryptString } from "@util/safe-storage";
import { Service } from "typedi";

import { SharedConfigService } from "../../../config/shared-config.service";
import { OwnedGamesResponse } from "./types";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

@Service()
export class SteamApiService {
  constructor(private readonly sharedConfigService: SharedConfigService) {}

  async getOwnedGames() {
    try {
      const config = this.sharedConfigService.get("integration_settings.state.steamIntegration");

      if (!config) {
        throw new Error("missing integration details");
      }

      const webApiKey = decryptString(config.webApiKey);
      const query = buildQueryParams({
        include_appinfo: "true",
        include_played_free_games: "true",
        key: webApiKey,
        steamid: config.steamId,
      });
      const response = await fetch(`${STEAM_API_BASE_URL}/IPlayerService/GetOwnedGames/v1${query}`, {
        headers: { accept: "application/json" },
        method: "GET",
      });

      const parsed: OwnedGamesResponse = await response.json();
      return parsed?.response?.games;
    } catch (err) {
      const message = "Request to Steam API failed";
      console.error(message, { err });
      throw new Error(message);
    }
  }
}
