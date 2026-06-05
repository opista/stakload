import { Library } from "@stakload/contracts/database/games";

import { OwnedGameDetails } from "../api/types";
import { InstalledGameData } from "../installed-games/types";

export type SteamSyncWorkerJobKind = "library";

type BaseSteamSyncWorkerMessage = {
  jobId: string;
  kind: SteamSyncWorkerJobKind;
};

export type SteamSyncWorkerRequest =
  {
    applicationPath: string;
    steamId: string;
    type: "run-library-job";
    webApiKey: string;
  } & BaseSteamSyncWorkerMessage;

export type SteamSyncWorkerResponse =
  | ({
      type: "job-started";
    } & BaseSteamSyncWorkerMessage)
  | ({
      installedGames: InstalledGameData[];
      library: Library;
      ownedGamesError?: string;
      ownedGames: OwnedGameDetails[];
      type: "library-scan-results";
    } & BaseSteamSyncWorkerMessage)
  | ({
      error: string;
      type: "job-failed";
    } & BaseSteamSyncWorkerMessage)
  | ({
      type: "job-complete";
    } & BaseSteamSyncWorkerMessage);
