import { GameStoreModel, Library } from "@stakload/contracts/database/games";

import { OwnedGameDetails } from "../api/types";
import { InstalledGameData } from "../installed-games/types";

export type SteamSyncWorkerJobKind = "library" | "metadata";

type BaseSteamSyncWorkerMessage = {
  jobId: string;
  kind: SteamSyncWorkerJobKind;
};

export type SteamSyncWorkerGame = Pick<GameStoreModel, "_id" | "gameId" | "name">;

export type SteamSyncWorkerMetadataResult =
  | {
      game: SteamSyncWorkerGame;
      metadata: GameStoreModel;
      status: "success";
    }
  | {
      error: string;
      game: SteamSyncWorkerGame;
      status: "failure";
    };

export type SteamSyncWorkerRequest =
  | ({
      applicationPath: string;
      steamId: string;
      type: "run-library-job";
      webApiKey: string;
    } & BaseSteamSyncWorkerMessage)
  | ({
      apiBaseUrl: string;
      batchSize: number;
      games: SteamSyncWorkerGame[];
      type: "run-metadata-job";
    } & BaseSteamSyncWorkerMessage);

export type SteamSyncWorkerResponse =
  | ({
      type: "job-started";
    } & BaseSteamSyncWorkerMessage)
  | ({
      installedGames: InstalledGameData[];
      library: Library;
      ownedGames: OwnedGameDetails[];
      type: "library-scan-results";
    } & BaseSteamSyncWorkerMessage)
  | ({
      processed: number;
      results: SteamSyncWorkerMetadataResult[];
      total: number;
      type: "metadata-batch-results";
    } & BaseSteamSyncWorkerMessage)
  | ({
      error: string;
      type: "job-failed";
    } & BaseSteamSyncWorkerMessage)
  | ({
      type: "job-complete";
    } & BaseSteamSyncWorkerMessage);
