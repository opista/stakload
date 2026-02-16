import { ConsoleLogger, Injectable } from "@nestjs/common";
import { runApplicationCommand } from "@util/run-application-command";

import { AuthResultModel, OwnedGame } from "./types";

/**
 * TODO
 *
 * We should look to implement the rest of the APIs for Legendary.
 * We also need to make the application name dynamic to support differing
 * operating systems
 */

const APPLICATION_NAME = "legendary";

@Injectable()
export class LegendaryService {
  constructor(private readonly logger: ConsoleLogger) {
    this.logger.setContext(this.constructor.name);
  }

  async getOwnedGames(): Promise<OwnedGame[]> {
    this.logger.debug("Fetching owned games using Legendary");
    try {
      const result = await runApplicationCommand(APPLICATION_NAME, "list", [
        "--force-refresh",
        "--include-non-installable",
        "--json",
        "--platform Windows",
      ]);
      const ownedGames: OwnedGame[] = JSON.parse(result.stdout);
      this.logger.log("Fetched owned games", { count: ownedGames.length });
      return ownedGames;
    } catch (error: unknown) {
      this.logger.error("Failed to fetch owned games using Legendary", { error });
      return [];
    }
  }

  async isLoggedIn(): Promise<boolean> {
    this.logger.debug("Checking Legendary login status");
    try {
      const result = await runApplicationCommand(APPLICATION_NAME, "status");
      const isLoggedIn = !result.stdout.includes("<not logged in>");
      this.logger.log("Legendary login status determined", { isLoggedIn });
      return isLoggedIn;
    } catch (error: unknown) {
      this.logger.error("Failed to check Legendary login status", { error });
      return false;
    }
  }

  async login(authorizationCode: string): Promise<AuthResultModel> {
    this.logger.debug("Attempting Legendary login", { authorizationCode });
    try {
      const result = await runApplicationCommand(APPLICATION_NAME, "auth", [`--code ${authorizationCode}`]);
      const match = /Successfully logged in as "(.*?)"/.exec(result.stderr);
      if (match) {
        this.logger.log("Legendary login successful", { username: match[1] });
        return {
          data: { username: match[1] },
          success: true,
        };
      }
      this.logger.warn("Legendary login did not match expected output", {
        stderr: result.stderr,
      });
      return { success: false };
    } catch (error: unknown) {
      this.logger.error("Legendary login failed", { error });
      return { success: false };
    }
  }

  async logout() {
    this.logger.debug("Attempting Legendary logout");
    try {
      await runApplicationCommand(APPLICATION_NAME, "auth", ["--delete"]);
      this.logger.log("Legendary logout successful");
      return { success: true };
    } catch (error: unknown) {
      this.logger.error("Legendary logout failed", { error });
      return { success: false };
    }
  }
}
