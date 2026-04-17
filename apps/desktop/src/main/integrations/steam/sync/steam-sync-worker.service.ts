import { Worker } from "node:worker_threads";

import { Injectable } from "@nestjs/common";

import { Logger } from "../../../logging/logging.service";
import workerPath from "./steam-sync.worker?modulePath";
import {
  SteamSyncWorkerRequest,
  SteamSyncWorkerResponse,
  SteamSyncWorkerGame,
  SteamSyncWorkerMetadataResult,
} from "./worker.types";

type MetadataJobInput = {
  apiBaseUrl: string;
  batchSize?: number;
  games: SteamSyncWorkerGame[];
};

type LibraryJobInput = {
  applicationPath: string;
  steamId: string;
  webApiKey: string;
};

@Injectable()
export class SteamSyncWorkerService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  private createWorker() {
    return new Worker(workerPath);
  }

  async runLibraryJob(input: LibraryJobInput) {
    const jobId = crypto.randomUUID();
    const worker = this.createWorker();

    this.logger.debug("Starting Steam library worker job", { jobId });

    return await new Promise<Extract<SteamSyncWorkerResponse, { type: "library-scan-results" }>>((resolve, reject) => {
      let result: Extract<SteamSyncWorkerResponse, { type: "library-scan-results" }> | null = null;

      const cleanup = async () => {
        await worker.terminate();
      };

      const handleFailure = async (error: unknown) => {
        await cleanup();
        reject(error);
      };

      worker.on("error", handleFailure);
      worker.on("message", async (message: SteamSyncWorkerResponse) => {
        if (message.jobId !== jobId) return;

        switch (message.type) {
          case "job-started":
            this.logger.debug("Steam library worker job started", { jobId });
            return;
          case "library-scan-results":
            result = message;
            return;
          case "job-failed":
            await handleFailure(new Error(message.error));
            return;
          case "job-complete":
            await cleanup();
            if (!result) {
              reject(new Error("Steam library worker completed without results"));
              return;
            }
            resolve(result);
            return;
          case "metadata-batch-results":
            return;
        }
      });

      const message: SteamSyncWorkerRequest = {
        ...input,
        jobId,
        kind: "library",
        type: "run-library-job",
      };

      worker.postMessage(message);
    });
  }

  async runMetadataJob(
    input: MetadataJobInput,
    onBatch: (results: SteamSyncWorkerMetadataResult[], progress: { processed: number; total: number }) => Promise<void>,
  ) {
    const jobId = crypto.randomUUID();
    const worker = this.createWorker();

    this.logger.debug("Starting Steam metadata worker job", {
      batchSize: input.batchSize ?? 10,
      count: input.games.length,
      jobId,
    });

    return await new Promise<void>((resolve, reject) => {
      let messageQueue = Promise.resolve();

      const cleanup = async () => {
        await worker.terminate();
      };

      const handleFailure = async (error: unknown) => {
        await cleanup();
        reject(error);
      };

      worker.on("error", handleFailure);
      worker.on("message", (message: SteamSyncWorkerResponse) => {
        if (message.jobId !== jobId) return;

        messageQueue = messageQueue
          .then(async () => {
            switch (message.type) {
              case "job-started":
                this.logger.debug("Steam metadata worker job started", { jobId });
                return;
              case "metadata-batch-results":
                await onBatch(message.results, {
                  processed: message.processed,
                  total: message.total,
                });
                return;
              case "job-failed":
                throw new Error(message.error);
              case "job-complete":
                await cleanup();
                resolve();
                return;
              case "library-scan-results":
                return;
            }
          })
          .catch(handleFailure);
      });

      const message: SteamSyncWorkerRequest = {
        apiBaseUrl: input.apiBaseUrl,
        batchSize: input.batchSize ?? 10,
        games: input.games,
        jobId,
        kind: "metadata",
        type: "run-metadata-job",
      };

      worker.postMessage(message);
    });
  }
}
