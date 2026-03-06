import { Mocked, TestBed } from "@suites/unit";

import { AppConfigService } from "../../config/app-config.service";
import { SyncRunnerService } from "./sync-runner.service";
import { SyncSchedulerService } from "./sync-scheduler.service";

describe("SyncSchedulerService", () => {
  let configService: Mocked<AppConfigService>;
  let service: SyncSchedulerService;
  let syncRunnerService: Mocked<SyncRunnerService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(SyncSchedulerService).compile();

    service = unit;
    configService = unitRef.get(AppConfigService);
    syncRunnerService = unitRef.get(SyncRunnerService);
  });

  it("should no-op when scheduled sync is disabled", async () => {
    Object.defineProperty(configService, "igdbScheduledSyncEnabled", {
      configurable: true,
      get: () => false,
    });

    await service.runScheduledSync();
    expect(syncRunnerService.runManagedSync).not.toHaveBeenCalled();
  });

  it("should run scheduled sync when enabled", async () => {
    Object.defineProperty(configService, "igdbScheduledSyncEnabled", {
      configurable: true,
      get: () => true,
    });
    void syncRunnerService.runManagedSync.mockResolvedValue(null);

    await service.runScheduledSync();
    expect(syncRunnerService.runManagedSync).toHaveBeenCalledWith("scheduled");
  });
});
