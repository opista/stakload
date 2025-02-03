import { SteamIntegrationDetails } from "@contracts/integrations/steam";
import { buildQueryParams } from "@util/build-query-params";
import { decryptString } from "@util/safe-storage";
import { Conf } from "electron-conf/main";
import { Service } from "typedi";
import { Inject } from "typedi";

import { OwnedGamesResponse } from "./types";

const STEAM_API_BASE_URL = "https://api.steampowered.com";

@Service()
export class SteamApiService {
  constructor(@Inject("conf") private readonly conf: Conf) {}

  async getOwnedGames() {
    const config = this.conf.get("integration_settings.state.steamIntegration") as SteamIntegrationDetails;
    const webApiKey = decryptString(config.webApiKey);
    const query = buildQueryParams({
      include_appinfo: "true",
      include_played_free_games: "true",
      key: webApiKey,
      steamid: config.steamId,
    });

    try {
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
