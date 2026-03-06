import { Mocked, TestBed } from "@suites/unit";
import { DataSource } from "typeorm";
import { vi } from "vitest";

import { AdminService } from "../../admin/admin.service";
import { SyncRunnerService } from "./sync-runner.service";

type DataSourceLike = {
  query: ReturnType<typeof vi.fn>;
};

describe("SyncRunnerService", () => {
  let adminService: Mocked<AdminService>;
  let dataSource: DataSourceLike;
  let service: SyncRunnerService;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(SyncRunnerService).compile();

    service = unit;
    adminService = unitRef.get(AdminService);
    dataSource = unitRef.get(DataSource);
  });

  it("should skip sync when lock is not acquired", async () => {
    void dataSource.query.mockResolvedValueOnce([{ locked: false }]);

    await expect(service.runManagedSync("scheduled")).resolves.toBeNull();
    expect(adminService.syncWebhooks).not.toHaveBeenCalled();
  });

  it("should run sync and release lock when acquired", async () => {
    void dataSource.query
      .mockResolvedValueOnce([{ locked: true }])
      .mockResolvedValueOnce([{ pg_advisory_unlock: true }]);
    void adminService.syncWebhooks.mockResolvedValue({
      created: [],
      deduplicated: [],
      desiredCount: 1,
      errors: [],
      existingManagedCount: 1,
      keptCount: 1,
    });

    await expect(service.runManagedSync("manual")).resolves.toMatchObject({ desiredCount: 1 });
    expect(adminService.syncWebhooks).toHaveBeenCalledOnce();
    expect(dataSource.query).toHaveBeenCalledTimes(2);
  });

  it("should always release lock after sync failure", async () => {
    void dataSource.query
      .mockResolvedValueOnce([{ locked: true }])
      .mockResolvedValueOnce([{ pg_advisory_unlock: true }]);
    void adminService.syncWebhooks.mockRejectedValue(new Error("sync failed"));

    await expect(service.runManagedSync("scheduled")).rejects.toThrow("sync failed");
    expect(dataSource.query).toHaveBeenCalledTimes(2);
  });
});
