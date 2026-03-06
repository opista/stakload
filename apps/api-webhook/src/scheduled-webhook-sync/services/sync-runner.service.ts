import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { DataSource } from "typeorm";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AdminService } from "../../admin/admin.service";
import type { SyncWebhooksResultDto } from "../../admin/dto/sync-webhooks-result.dto";
import { WEBHOOK_SYNC_ADVISORY_LOCK_KEY } from "../constants/sync-lock.constants";

type SyncRunReason = "manual" | "scheduled";

@Injectable()
export class SyncRunnerService {
  constructor(
    @Inject(forwardRef(() => AdminService))
    private readonly adminService: AdminService,
    private readonly dataSource: DataSource,
    private readonly logger: PinoLogger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  private async acquireLock(): Promise<boolean> {
    const result = await this.dataSource.query("SELECT pg_try_advisory_lock($1::bigint) AS locked", [
      WEBHOOK_SYNC_ADVISORY_LOCK_KEY.toString(),
    ]);

    const value = result.at(0)?.locked;

    return value === true || value === "t" || value === "true";
  }

  private async releaseLock(): Promise<void> {
    await this.dataSource.query("SELECT pg_advisory_unlock($1::bigint)", [WEBHOOK_SYNC_ADVISORY_LOCK_KEY.toString()]);
  }

  async runManagedSync(reason: SyncRunReason): Promise<SyncWebhooksResultDto | null> {
    const startedAt = Date.now();
    const lockAcquired = await this.acquireLock();

    if (lockAcquired === false) {
      this.logger.warn({ reason }, "Skipping managed webhook sync because another run holds the lock");

      return null;
    }

    try {
      const result = await this.adminService.syncWebhooks();

      this.logger.info(
        {
          createdCount: result.created.length,
          deduplicatedCount: result.deduplicated.length,
          durationMs: Date.now() - startedAt,
          errorsCount: result.errors.length,
          reason,
        },
        "Managed webhook sync completed",
      );

      return result;
    } finally {
      await this.releaseLock();
    }
  }
}
