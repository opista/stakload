import { Mocked, TestBed } from "@suites/unit";

import { AdminController } from "./admin.controller";
import { AdminService } from "./admin.service";

describe("AdminController", () => {
  let controller: AdminController;
  let service: Mocked<AdminService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AdminController).compile();

    controller = unit;
    service = unitRef.get(AdminService);
  });

  it("should list webhooks", async () => {
    void service.listWebhooks.mockResolvedValue([]);

    await expect(controller.listWebhooks()).resolves.toEqual([]);
  });

  it("should create a webhook", async () => {
    void service.createWebhook.mockResolvedValue({
      action: "update",
      active: true,
      apiKey: "client-id",
      category: 1,
      createdAt: "2026-03-04T00:00:00.000Z",
      id: 42,
      managedByService: true,
      resource: "games",
      secret: "secret",
      subCategory: 2,
      supportedByService: true,
      updatedAt: "2026-03-04T00:00:00.000Z",
      url: "https://hooks.example.com/webhooks/igdb/games/update",
    });

    await expect(controller.createWebhook({ action: "update", resource: "games" })).resolves.toMatchObject({
      action: "update",
      id: 42,
      resource: "games",
    });
  });

  it("should delete a webhook", async () => {
    void service.deleteWebhook.mockResolvedValue({ id: 42 });

    await expect(controller.deleteWebhook(42)).resolves.toEqual({ id: 42 });
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
});
