import { ConflictException } from "@nestjs/common";
import { Mocked, TestBed } from "@suites/unit";

import { AppConfigService } from "../config/app-config.service";
import { IgdbApiService } from "../igdb-api/igdb-api.service";
import { IgdbApiError } from "../igdb-api/types/igdb-api.types";
import { AdminService } from "./admin.service";

describe("AdminService", () => {
  let apiService: Mocked<IgdbApiService>;
  let configService: Mocked<AppConfigService>;
  let service: AdminService;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(AdminService).compile();

    service = unit;
    apiService = unitRef.get(IgdbApiService);
    configService = unitRef.get(AppConfigService);

    Object.defineProperties(configService, {
      igdbWebhookSecret: {
        configurable: true,
        get: () => "webhook-secret",
      },
      publicWebhookBaseUrl: {
        configurable: true,
        get: () => "https://hooks.example.com",
      },
    });
  });

  it("should derive the callback url and create a supported webhook", async () => {
    void apiService.createWebhook.mockResolvedValue({
      active: true,
      api_key: "client-id",
      category: 8,
      created_at: "2026-03-04T00:00:00.000Z",
      id: 42,
      secret: "webhook-secret",
      sub_category: 2,
      updated_at: "2026-03-04T00:00:00.000Z",
      url: "https://hooks.example.com/webhooks/igdb/games/update",
    });

    await expect(service.createWebhook("games", "update")).resolves.toMatchObject({
      action: "update",
      id: 42,
      managedByService: true,
      resource: "games",
      supportedByService: true,
      url: "https://hooks.example.com/webhooks/igdb/games/update",
    });

    expect(apiService.createWebhook).toHaveBeenCalledWith({
      action: "update",
      resource: "games",
      secret: "webhook-secret",
      url: "https://hooks.example.com/webhooks/igdb/games/update",
    });
  });

  it("should mark non-managed webhooks without inferred resource metadata", async () => {
    void apiService.listWebhooks.mockResolvedValue([
      {
        active: true,
        api_key: "client-id",
        category: 8,
        created_at: "2026-03-04T00:00:00.000Z",
        id: 42,
        secret: "webhook-secret",
        sub_category: 2,
        updated_at: "2026-03-04T00:00:00.000Z",
        url: "https://legacy.example.com/igdb",
      },
    ]);

    await expect(service.listWebhooks()).resolves.toEqual([
      {
        action: null,
        active: true,
        apiKey: "client-id",
        category: 8,
        createdAt: "2026-03-04T00:00:00.000Z",
        id: 42,
        managedByService: false,
        resource: null,
        secret: "webhook-secret",
        subCategory: 2,
        supportedByService: false,
        updatedAt: "2026-03-04T00:00:00.000Z",
        url: "https://legacy.example.com/igdb",
      },
    ]);
  });

  it("should forward delete by id", async () => {
    void apiService.deleteWebhook.mockResolvedValue({ id: "42" });

    await expect(service.deleteWebhook(42)).resolves.toEqual({ id: 42 });
  });

  it("should require explicit resource and entity id for tests", async () => {
    void apiService.testWebhook.mockResolvedValue({ ok: true });

    await expect(service.testWebhook(42, "games", 1337)).resolves.toEqual({
      entityId: 1337,
      resource: "games",
      result: { ok: true },
      webhookId: 42,
    });
  });

  it("should map IGDB conflicts to a Nest conflict exception", async () => {
    void apiService.createWebhook.mockRejectedValue(
      new IgdbApiError("Already exists", 409, { message: "Already exists" }),
    );

    await expect(service.createWebhook("games", "update")).rejects.toBeInstanceOf(ConflictException);
  });
});
