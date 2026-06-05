import { parentPort } from "worker_threads";

import { fetchOwnedGames } from "../api/fetch-owned-games";
import { readSteamInstalledGames } from "../installed-games/read-steam-installed-games";
import { SteamSyncWorkerRequest, SteamSyncWorkerResponse } from "./worker.types";

const parent = parentPort;
if (!parent) {
  throw new Error("Steam sync worker requires a parent port");
}

const postMessage = (message: SteamSyncWorkerResponse) => {
  parent.postMessage(message);
};

const toErrorMessage = (error: unknown) => (error instanceof Error ? error.message : "Unknown error");

const runLibraryJob = async (message: Extract<SteamSyncWorkerRequest, { type: "run-library-job" }>) => {
  const [ownedGamesResult, installedGames] = await Promise.all([
    fetchOwnedGames(message.webApiKey, message.steamId)
      .then((ownedGames) => ({ ownedGames, ownedGamesError: undefined }))
      .catch((error) => ({ ownedGames: [], ownedGamesError: toErrorMessage(error) })),
    readSteamInstalledGames(message.applicationPath),
  ]);

  postMessage({
    installedGames,
    jobId: message.jobId,
    kind: message.kind,
    library: "steam",
    ownedGames: ownedGamesResult.ownedGames,
    ownedGamesError: ownedGamesResult.ownedGamesError,
    type: "library-scan-results",
  });
};

parent.on("message", async (message: SteamSyncWorkerRequest) => {
  postMessage({
    jobId: message.jobId,
    kind: message.kind,
    type: "job-started",
  });

  try {
    switch (message.type) {
      case "run-library-job":
        await runLibraryJob(message);
        break;
    }

    postMessage({
      jobId: message.jobId,
      kind: message.kind,
      type: "job-complete",
    });
  } catch (error: unknown) {
    postMessage({
      error: toErrorMessage(error),
      jobId: message.jobId,
      kind: message.kind,
      type: "job-failed",
    });
  }
});
