import { Injectable } from "@nestjs/common";
import fastq from "fastq";

import {
  GAME_ICONS,
  GameMetadata,
  GameMetadataSource,
  GameStoreModel,
  isGameMetadataSource,
  Library,
} from "@stakload/contracts/database/games";
import { NOTIFICATION_KEYS } from "@stakload/contracts/store/notification";
import { GameSyncMessage } from "@stakload/contracts/sync";

import { EVENT_CHANNELS } from "../../preload/channels";
import { SharedConfigService } from "../config/shared-config.service";
import { GameStore } from "../game/game.store";
import { mapOwnedGameDetailsToGameStoreModel } from "../integrations/steam/sync/mappers/map-owned-game-details-to-game-store-model";
import { SteamSyncWorkerService } from "../integrations/steam/sync/steam-sync-worker.service";
import { SteamLibraryService } from "../integrations/steam/sync/steam-sync.service";
import { Logger } from "../logging/logging.service";
import { NotificationService } from "../notification/notification.service";
import { StakloadApiClient } from "../stackload-api/stakload-api.client";
import { WindowService } from "../window/window.service";
import { SyncRegistryService } from "./sync-registry/sync-registry.service";
import { FailureHistoryEntry } from "./types";

type MetadataSyncGame = GameStoreModel & {
  gameId: string;
  library: GameMetadataSource;
};

type MetadataSyncBatch = {
  games: MetadataSyncGame[];
  source: GameMetadataSource;
};

export type SyncOptions = {
  metadataMode?: "all" | "pending";
};

const METADATA_BATCH_CONCURRENCY = 2;
const METADATA_BATCH_SIZE = 50;

@Injectable()
export class SyncService {
  private failures: FailureHistoryEntry[] = [];
  private gamesAdded: number = 0;
  private lastMetadataEventAt: number = 0;
  private libraryQueue = fastq.promise(this.libraryWorker.bind(this), 1);
  private metadataBatchQueue = fastq.promise(this.metadataBatchWorker.bind(this), METADATA_BATCH_CONCURRENCY);
  private metadataToProcess: number = 0;
  private processing: number = 0;
  private syncInProgress = false;

  constructor(
    private gameStore: GameStore,
    private logger: Logger,
    private notificationService: NotificationService,
    private sharedConfigService: SharedConfigService,
    private stakloadApiClient: StakloadApiClient,
    private syncRegistryService: SyncRegistryService,
    private steamLibraryService: SteamLibraryService,
    private steamSyncWorkerService: SteamSyncWorkerService,
    private windowService: WindowService,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private addFailureEntry(entry: FailureHistoryEntry) {
    this.failures.push(entry);
  }

  private buildMetadataBatches(games: MetadataSyncGame[]): MetadataSyncBatch[] {
    const batches: MetadataSyncBatch[] = [];
    const gamesBySource = new Map<GameMetadataSource, MetadataSyncGame[]>();

    for (const game of games) {
      gamesBySource.set(game.library, [...(gamesBySource.get(game.library) ?? []), game]);
    }

    for (const [source, sourceGames] of gamesBySource) {
      for (let index = 0; index < sourceGames.length; index += METADATA_BATCH_SIZE) {
        batches.push({
          games: sourceGames.slice(index, index + METADATA_BATCH_SIZE),
          source,
        });
      }
    }

    return batches;
  }

  private emitMetadataProgress(force = false) {
    if (!this.metadataToProcess) return;
    const now = Date.now();
    const shouldEmit = force || this.processing >= this.metadataToProcess || now - this.lastMetadataEventAt >= 250;
    if (!shouldEmit) return;

    this.lastMetadataEventAt = now;
    this.emitSyncEvent({
      action: "metadata",
      processing: this.processing,
      total: this.metadataToProcess,
    });
  }

  private emitSyncEvent(message: GameSyncMessage) {
    this.windowService.sendEvent(EVENT_CHANNELS.GAME_SYNC_STATUS, message);
  }

  private getEnabledLibraries() {
    const libraries = this.sharedConfigService.get("integration_settings.state.integrationsEnabled");
    return Object.entries(libraries || {})
      .filter(([, enabled]) => enabled)
      .map(([library]) => library as Library);
  }

  private async libraryWorker(library: Library) {
    this.logger.log("Initiating library sync", { library });
    this.emitSyncEvent({
      action: "library",
      library,
    });

    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) {
      this.logger.error("Library integration not supported", { library });
      this.addFailureEntry({
        action: "library",
        code: "UNSUPPORTED_LIBRARY",
        library,
      });
      return;
    }

    try {
      if (library === "steam") {
        await this.synchroniseSteamLibrary();
        return;
      }

      const numberOfNewGames = await libraryImpl.addNewGames();
      this.gamesAdded += numberOfNewGames;
      this.logger.log("Added new games", { library, numberOfNewGames });

      await libraryImpl.updateInstalledGames();
      this.logger.log("Updated installed games", { library });
    } catch (error: unknown) {
      this.logger.error("Error synchronising library", { error, library });
      this.addFailureEntry({
        action: "library",
        code: "UNKNOWN_ERROR",
        library,
      });
    }
  }

  private mapMetadataToGameUpdates(metadata: GameMetadata): Partial<Omit<GameStoreModel, "_id" | "createdAt">> {
    const updates = { ...metadata };
    Reflect.deleteProperty(updates, "externalGameId");
    Reflect.deleteProperty(updates, "source");
    return updates;
  }

  private async metadataBatchWorker(batch: MetadataSyncBatch) {
    try {
      this.logger.log("Starting metadata sync batch", {
        count: batch.games.length,
        source: batch.source,
      });
      const metadata = await this.stakloadApiClient.getGamesMetadata(
        batch.source,
        batch.games.map((game) => game.gameId),
      );
      const metadataByExternalGameId = new Map(metadata.map((entry) => [entry.externalGameId, entry] as const));
      const successfulEntries = batch.games.flatMap((game) => {
        const entry = metadataByExternalGameId.get(game.gameId);
        if (!entry) return [];

        return [
          {
            id: game._id,
            metadata: this.mapMetadataToGameUpdates(entry),
          },
        ];
      });

      if (successfulEntries.length) {
        await this.gameStore.applyMetadataSyncBatch(successfulEntries);
      }

      const missingIds = batch.games
        .filter((game) => !metadataByExternalGameId.has(game.gameId))
        .map((game) => game._id);

      if (missingIds.length) {
        await this.gameStore.markMetadataSynchronised(missingIds);
      }

      this.logger.log("Metadata sync batch complete", {
        found: successfulEntries.length,
        missing: missingIds.length,
        source: batch.source,
      });
    } catch (error: unknown) {
      this.logger.error("Error synchronising metadata batch", {
        count: batch.games.length,
        error,
        source: batch.source,
      });
      this.addFailureEntry({
        action: "metadata",
        code: "UNKNOWN_ERROR",
        library: batch.source,
      });
    } finally {
      this.processing += batch.games.length;
      this.emitMetadataProgress();
    }
  }

  private async prepareMetadataSyncGames(games: GameStoreModel[]): Promise<MetadataSyncGame[]> {
    const preparedGames: MetadataSyncGame[] = [];
    const synchronisedIds: string[] = [];

    for (const game of games) {
      if (!isGameMetadataSource(game.library)) {
        synchronisedIds.push(game._id);
        continue;
      }

      let gameId = game.gameId;
      if (!gameId) {
        const libraryImpl = this.syncRegistryService.getLibrary(game.library);
        gameId = (await libraryImpl?.resolveMetadataGameId?.(game)) ?? undefined;
      }

      if (!gameId) {
        synchronisedIds.push(game._id);
        continue;
      }

      preparedGames.push({
        ...game,
        gameId,
        library: game.library,
      });
    }

    if (synchronisedIds.length) {
      await this.gameStore.markMetadataSynchronised(synchronisedIds);
      this.processing += synchronisedIds.length;
      this.emitMetadataProgress();
    }

    return preparedGames;
  }

  private reset() {
    this.failures = [];
    this.processing = 0;
    this.syncInProgress = false;
    this.metadataToProcess = 0;
    this.gamesAdded = 0;
    this.lastMetadataEventAt = 0;
  }

  private async synchroniseSteamLibrary() {
    const { applicationPath, steamId, webApiKey } = await this.steamLibraryService.getSyncContext();
    const { installedGames, ownedGames, ownedGamesError } = await this.steamSyncWorkerService.runLibraryJob({
      applicationPath,
      steamId,
      webApiKey,
    });

    if (ownedGamesError) {
      this.logger.warn("Steam owned games sync failed; continuing with installed game reconciliation", {
        error: ownedGamesError,
      });
      this.addFailureEntry({
        action: "library",
        code: "UNKNOWN_ERROR",
        library: "steam",
      });
    }

    const existingGames = await this.gameStore.findGamesByGameIds(
      ownedGames.map((game) => String(game.appid)),
      "steam",
    );
    const existingIds = new Set(existingGames.map((game) => game.gameId));
    const mappedGames = ownedGames
      .filter((game) => !existingIds.has(String(game.appid)))
      .map(mapOwnedGameDetailsToGameStoreModel);

    if (mappedGames.length) {
      await this.gameStore.bulkInsertGames(mappedGames);
    }

    await this.gameStore.reconcileInstalledGames("steam", installedGames);
    this.gamesAdded += mappedGames.length;

    this.logger.log("Steam library sync complete", {
      gamesAdded: mappedGames.length,
      installedCount: installedGames.length,
      ownedCount: ownedGames.length,
    });
  }

  private async syncLibraries(libraries: Library[], options: SyncOptions = {}) {
    try {
      this.logger.log("Starting sync for enabled libraries", { libraries, options });
      await Promise.all(libraries.map((library) => this.libraryQueue.push(library)));
      await this.libraryQueue.drained();

      const metadataSyncCandidates =
        options.metadataMode === "all" ? await this.gameStore.findUnarchivedGames() : await this.gameStore.findUnsyncedGames();

      this.metadataToProcess = metadataSyncCandidates.length;
      this.emitMetadataProgress(true);

      const metadataGames = await this.prepareMetadataSyncGames(metadataSyncCandidates);
      const metadataBatches = this.buildMetadataBatches(metadataGames);

      await Promise.all(metadataBatches.map((batch) => this.metadataBatchQueue.push(batch)));
      await this.metadataBatchQueue.drained();
      this.emitMetadataProgress(true);
    } catch (error: unknown) {
      this.logger.error("Sync operation failed", error);
      this.addFailureEntry({
        action: "metadata",
        code: "UNKNOWN_ERROR",
      });
    } finally {
      this.emitSyncEvent({
        action: "complete",
        hasFailures: !!this.failures.length,
        total: this.gamesAdded,
      });
      this.logger.log("Sync operation complete", {
        failures: this.failures.length,
        syncFailures: this.failures,
        totalGamesAdded: this.gamesAdded,
      });
      this.syncInProgress = false;
    }
  }

  async authenticate(library: Library, data?: unknown) {
    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) return false;

    this.logger.debug("Authenticating integration", { library });
    return libraryImpl.authenticate(data);
  }

  async isIntegrationValid(library: Library) {
    const libraryImpl = this.syncRegistryService.getLibrary(library);
    if (!libraryImpl) return false;

    const isValid = await libraryImpl.isIntegrationValid();

    if (isValid) {
      this.notificationService.success({
        icon: GAME_ICONS[library],
        message: NOTIFICATION_KEYS.INTEGRATION_SUCCESS_MESSAGE,
        title: NOTIFICATION_KEYS.INTEGRATION_SUCCESS_TITLE,
      });
    } else {
      this.notificationService.error({
        icon: GAME_ICONS[library],
        message: NOTIFICATION_KEYS.INTEGRATION_FAILED_MESSAGE,
        title: NOTIFICATION_KEYS.INTEGRATION_FAILED_TITLE,
      });
    }

    return isValid;
  }

  sync(options: SyncOptions = {}) {
    if (this.syncInProgress) {
      this.logger.warn("Sync operation already in progress");
      return false;
    }

    const enabledLibraries = this.getEnabledLibraries();
    this.logger.log("Initiating sync", { enabledLibraries, options });
    this.reset();
    this.syncInProgress = true;
    void this.syncLibraries(enabledLibraries, options);

    return true;
  }
}
