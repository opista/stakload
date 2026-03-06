import { Mocked, TestBed } from "@suites/unit";

import { SyncRunnerService } from "../scheduled-webhook-sync/services/sync-runner.service";
import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

describe("AdminController", () => {
  let controller: AdminController;
  let service: Mocked<AdminService>;
  let syncRunnerService: Mocked<SyncRunnerService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AdminController).compile();

    controller = unit;
    service = unitRef.get(AdminService);
    syncRunnerService = unitRef.get(SyncRunnerService);
  });

  it("should list webhooks", async () => {
    void service.listWebhooks.mockResolvedValue([]);

    await expect(controller.listWebhooks()).resolves.toEqual([]);
  });

  it("should create a webhook", async () => {
    void service.createWebhook.mockResolvedValue({
      action: "update",
      active: true,
      category: 1,
      createdAt: 1772668800,
      id: 42,
      managedByService: true,
      resource: "games",
      subCategory: 2,
      supportedByService: true,
      updatedAt: 1772668800,
      url: "https://hooks.example.com/webhooks/games/update",
    });

    await expect(controller.createWebhook({ action: "update", resource: "games" })).resolves.toMatchObject({
      action: "update",
      id: 42,
      resource: "games",
    });
  });

  it("should delete a webhook", async () => {
    void service.deleteWebhook.mockResolvedValue({ success: true });

    await expect(controller.deleteWebhook(42)).resolves.toEqual({ success: true });
  });

  it("should trigger a webhook test", async () => {
    void service.testWebhook.mockResolvedValue({
      entityId: 1337,
      resource: "games",
      result: { ok: true },
      webhookId: 42,
    });

    await expect(controller.testWebhook({ entityId: 1337, resource: "games" }, 42)).resolves.toEqual({
      entityId: 1337,
      resource: "games",
      result: { ok: true },
      webhookId: 42,
    });
  });

  it("should sync webhooks", async () => {
    void syncRunnerService.runManagedSync.mockResolvedValue({
      created: [],
      deduplicated: [],
      desiredCount: 3,
      errors: [],
      existingManagedCount: 1,
      keptCount: 1,
    });
    const response = { status: vi.fn() };

    await expect(controller.syncWebhooks(response as never)).resolves.toEqual({
      created: [],
      deduplicated: [],
      desiredCount: 3,
      errors: [],
      existingManagedCount: 1,
      keptCount: 1,
    });
    expect(syncRunnerService.runManagedSync).toHaveBeenCalledWith("manual");
  });

  it("should return a skipped response when sync lock is busy", async () => {
    void syncRunnerService.runManagedSync.mockResolvedValue(null);
    const response = { status: vi.fn() };

    await expect(controller.syncWebhooks(response as never)).resolves.toEqual({
      reason: "sync_already_running",
      status: "skipped",
    });
    expect(response.status).toHaveBeenCalledWith(202);
  });

  it("should purge webhooks", async () => {
    void service.purgeWebhooks.mockResolvedValue({
      deleted: [{ id: 42 }],
      errors: [],
      totalCandidates: 1,
    });

    await expect(controller.purgeWebhooks(true)).resolves.toEqual({
      deleted: [{ id: 42 }],
      errors: [],
      totalCandidates: 1,
    });
  });
});



