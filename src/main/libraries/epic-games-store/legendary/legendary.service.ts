import { runApplicationCommand } from "@util/run-application-command";
import { Service } from "typedi";

import { AuthResultModel, OwnedGame } from "./types";

/**
 * TODO
 *
 * We should look to implement the rest of the APIs for Legendary.
 * We also need to make the application name dynamic to support differing
 * operating systems
 */

const APPLICATION_NAME = "legendary";

@Service()
export class LegendaryService {
  async login(authorizationCode: string): Promise<AuthResultModel> {
    try {
      const result = await runApplicationCommand(APPLICATION_NAME, "auth", [`--code ${authorizationCode}`]);

      const match = /Successfully logged in as "(.*?)"/.exec(result.stderr);
      if (match) {
        return {
          data: {
            username: match[1],
          },
          success: true,
        };
      }

      return {
        success: false,
      };
    } catch (err) {
      // TODO - logging
      return {
        success: false,
      };
    }
  }

  async logout() {
    try {
      await runApplicationCommand(APPLICATION_NAME, "auth", ["--delete"]);
      return { success: true };
    } catch (err) {
      // TODO - logging
      return {
        success: false,
      };
    }
  }

  async getOwnedGames(): Promise<OwnedGame[]> {
    try {
      const result = await runApplicationCommand(APPLICATION_NAME, "list", [
        "--force-refresh",
        "--include-non-installable",
        "--json",
        "--platform Windows",
      ]);

      return JSON.parse(result.stdout);
    } catch (err) {
      console.log("something went wrong", err);
      return [];
    }
  }
}
