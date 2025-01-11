import { runApplicationCommand } from "../../util/run-application-command";
import { OwnedGame } from "./types/owned-game";

/**
 * TODO
 *
 * We should look to implement the rest of the APIs for Legendary.
 * We also need to make the application name dynamic to support differing
 * operating systems
 */

const APPLICATION_NAME = "legendary";

type LoginModel = {
  data?: {
    username?: string;
  };
  success: boolean;
};

export const login = async (authorizationCode: string): Promise<LoginModel> => {
  try {
    const result = await runApplicationCommand(APPLICATION_NAME, "auth", [`--code ${authorizationCode}`]);

    const match = /Successfully logged in as "(.*?)"/.exec(result.stderr);
    if (match) {
      return {
        success: true,
        data: {
          username: match[1],
        },
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
};

export const logout = async () => {
  try {
    await runApplicationCommand(APPLICATION_NAME, "auth", ["--delete"]);
    return { success: true };
  } catch (err) {
    // TODO - logging
    return {
      success: false,
    };
  }
};

export const getOwnedGames = async (): Promise<OwnedGame[]> => {
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
};
