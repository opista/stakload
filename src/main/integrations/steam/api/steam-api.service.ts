import { buildQueryParams } from "@util/build-query-params";
import { Service } from "typedi";

import { SharedConfigService } from "../../../config/shared-config.service";
import { OwnedGamesResponse } from "./types";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

@Service()
export class SteamApiService {
  constructor(private readonly sharedConfigService: SharedConfigService) {}

  async getOwnedGames() {
    try {
      const steamId = this.sharedConfigService.get("integration_settings.state.steamIntegration.steamId");
      const webApiKey = this.sharedConfigService.get("integration_settings.state.steamIntegration.webApiKey", {
        decrypt: true,
      });

      if (!steamId || !webApiKey) {
        throw new Error("Steam ID or web API key not found");
      }

      const query = buildQueryParams({
        include_appinfo: "true",
        include_played_free_games: "true",
        key: webApiKey,
        steamid: steamId,
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
