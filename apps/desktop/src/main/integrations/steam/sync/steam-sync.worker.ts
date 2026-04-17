import { parentPort } from "worker_threads";

import { ExternalGameSource } from "@stakload/contracts/database/games";

import { fetchGameMetadata } from "../../../stackload-api/fetch-game-metadata";
import { fetchOwnedGames } from "../api/fetch-owned-games";
import { readSteamInstalledGames } from "../installed-games/read-steam-installed-games";
import { SteamSyncWorkerMetadataResult, SteamSyncWorkerRequest, SteamSyncWorkerResponse } from "./worker.types";

const parent = parentPort;

if (!parent) {
  throw new Error("Steam sync worker requires a parent port");
}

const postMessage = (message: SteamSyncWorkerResponse) => {
  parent.postMessage(message);
};

const toErrorMessage = (error: unknown) => (error instanceof Error ? error.message : "Unknown error");

const runLibraryJob = async (message: Extract<SteamSyncWorkerRequest, { type: "run-library-job" }>) => {
  const [ownedGames, installedGames] = await Promise.all([
    fetchOwnedGames(message.webApiKey, message.steamId),
    readSteamInstalledGames(message.applicationPath),
  ]);

  postMessage({
    installedGames,
    jobId: message.jobId,
    kind: message.kind,
    library: "steam",
    ownedGames,
    type: "library-scan-results",
  });
};

const runMetadataJob = async (message: Extract<SteamSyncWorkerRequest, { type: "run-metadata-job" }>) => {
  let processed = 0;

  for (let index = 0; index < message.games.length; index += message.batchSize) {
    const chunk = message.games.slice(index, index + message.batchSize);
    const settled = await Promise.allSettled(
      chunk.map(async (game) => {
        if (!game.gameId) {
          throw new Error("Missing game id");
        }
        return await fetchGameMetadata(message.apiBaseUrl, game.gameId, ExternalGameSource.Steam);
      }),
    );

    const results: SteamSyncWorkerMetadataResult[] = chunk.map((game, chunkIndex) => {
      const result = settled[chunkIndex];
      if (result.status === "fulfilled" && result.value) {
        return {
          game,
          metadata: result.value,
          status: "success",
        };
      }

      return {
        error: result.status === "rejected" ? toErrorMessage(result.reason) : "Metadata not found",
        game,
        status: "failure",
      };
    });

    processed += chunk.length;
    postMessage({
      jobId: message.jobId,
      kind: message.kind,
      processed,
      results,
      total: message.games.length,
      type: "metadata-batch-results",
    });
  }
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
      case "run-metadata-job":
        await runMetadataJob(message);
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
