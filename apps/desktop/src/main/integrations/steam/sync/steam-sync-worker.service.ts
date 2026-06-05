import { randomUUID } from "node:crypto";
import { Worker } from "node:worker_threads";

import { Injectable } from "@nestjs/common";

import { Logger } from "../../../logging/logging.service";
import workerPath from "./steam-sync.worker?modulePath";
import { SteamSyncWorkerRequest, SteamSyncWorkerResponse } from "./worker.types";

type LibraryJobInput = {
  applicationPath: string;
  steamId: string;
  webApiKey: string;
};

const STEAM_SYNC_WORKER_INACTIVITY_TIMEOUT_MS = 5 * 60 * 1000;

@Injectable()
export class SteamSyncWorkerService {
  constructor(private readonly logger: Logger) {
    this.logger.setContext(this.constructor.name);
  }

  private createWorker() {
    return new Worker(workerPath);
  }

  async runLibraryJob(input: LibraryJobInput) {
    const jobId = randomUUID();
    const worker = this.createWorker();

    this.logger.debug("Starting Steam library worker job", { jobId });

    return await new Promise<Extract<SteamSyncWorkerResponse, { type: "library-scan-results" }>>((resolve, reject) => {
      let result: Extract<SteamSyncWorkerResponse, { type: "library-scan-results" }> | null = null;
      let settled = false;
      let timeout: ReturnType<typeof setTimeout>;

      const cleanup = async () => {
        clearTimeout(timeout);
        worker.removeAllListeners();
        try {
          await worker.terminate();
        } catch (error) {
          this.logger.error("Failed to terminate Steam library worker", error, { jobId });
        }
      };

      const handleFailure = async (error: unknown) => {
        if (settled) return;
        settled = true;
        await cleanup();
        reject(error);
      };

      const handleSuccess = async (
        response: Extract<SteamSyncWorkerResponse, { type: "library-scan-results" }>,
      ) => {
        if (settled) return;
        settled = true;
        await cleanup();
        resolve(response);
      };

      const refreshTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          void handleFailure(new Error("Steam library worker job timed out"));
        }, STEAM_SYNC_WORKER_INACTIVITY_TIMEOUT_MS);
      };

      worker.on("error", handleFailure);
      worker.on("exit", (code) => {
        if (!settled) {
          const message =
            code === 0
              ? "Steam library worker exited before completing"
              : `Steam library worker exited with code ${code}`;
          void handleFailure(new Error(message));
        }
      });
      worker.on("message", async (message: SteamSyncWorkerResponse) => {
        if (message.jobId !== jobId) return;
        refreshTimeout();

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
            if (!result) {
              await handleFailure(new Error("Steam library worker completed without results"));
              return;
            }
            await handleSuccess(result);
            return;
        }
      });

      const message: SteamSyncWorkerRequest = {
        ...input,
        jobId,
        kind: "library",
        type: "run-library-job",
      };

      refreshTimeout();
      try {
        worker.postMessage(message);
      } catch (error) {
        void handleFailure(error);
      }
    });
  }

}
