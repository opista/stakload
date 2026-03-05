import type { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { mock, type Mocked } from "@suites/doubles.vitest";
import request from "supertest";
import { vi } from "vitest";

import { PinoLogger } from "@stakload/nestjs-logging";

import { AdminController } from "../src/admin/admin.controller";
import { AdminService } from "../src/admin/admin.service";
import { AppConfigService } from "../src/config/app-config.service";
import { IgdbWebhookSecretGuard } from "../src/webhooks/guards/igdb-webhook-secret.guard";

describe("AdminController (integration)", () => {
  let app: INestApplication;
  let adminService: Mocked<AdminService>;
  let configService: Mocked<AppConfigService>;
  let logger: Mocked<PinoLogger>;

  beforeEach(async () => {
    adminService = mock<AdminService>();
    configService = mock<AppConfigService>();
    logger = mock<PinoLogger>();

    Object.defineProperty(configService, "igdbWebhookSecret", {
      configurable: true,
      get: () => "webhook-secret",
    });

    const moduleRef = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        IgdbWebhookSecretGuard,
        {
          provide: AppConfigService,
          useValue: configService,
        },
        {
          provide: AdminService,
          useValue: adminService,
        },
        {
          provide: PinoLogger,
          useValue: logger,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
    vi.clearAllMocks();
  });

  const getServer = (): Parameters<typeof request>[0] => app.getHttpServer() as Parameters<typeof request>[0];

  it("should reject requests with an invalid admin secret", async () => {
    await request(getServer()).get("/admin/webhooks").set("x-secret", "wrong-secret").expect(401);
  });

  it("should list webhooks with a valid admin secret", async () => {
    void adminService.listWebhooks.mockResolvedValue([]);

    await request(getServer()).get("/admin/webhooks").set("x-secret", "webhook-secret").expect(200);
    expect(adminService.listWebhooks).toHaveBeenCalledOnce();
  });

  it("should reject invalid create payloads", async () => {
    await request(getServer())
      .post("/admin/webhooks")
      .set("x-secret", "webhook-secret")
      .send({ action: "update", resource: "search" })
      .expect(400);
  });

  it("should create webhooks with a valid payload", async () => {
    void adminService.createWebhook.mockResolvedValue({
      action: "update",
      active: true,
      apiKey: "client-id",
      category: 8,
      createdAt: "2026-03-04T00:00:00.000Z",
      id: 42,
      managedByService: true,
      resource: "games",
      secret: "secret",
      subCategory: 2,
      supportedByService: true,
      updatedAt: "2026-03-04T00:00:00.000Z",
      url: "https://hooks.example.com/webhooks/games/update",
    });

    await request(getServer())
      .post("/admin/webhooks")
      .set("x-secret", "webhook-secret")
      .send({ action: "update", resource: "games" })
      .expect(201);

    expect(adminService.createWebhook).toHaveBeenCalledWith("games", "update");
  });

  it("should reject invalid webhook ids for delete", async () => {
    await request(getServer()).delete("/admin/webhooks/not-an-int").set("x-secret", "webhook-secret").expect(400);
  });

  it("should delete webhooks by id", async () => {
    void adminService.deleteWebhook.mockResolvedValue({ id: 42 });

    await request(getServer()).delete("/admin/webhooks/42").set("x-secret", "webhook-secret").expect(200);

    expect(adminService.deleteWebhook).toHaveBeenCalledWith(42);
  });

  it("should reject invalid test payloads", async () => {
    await request(getServer())
      .post("/admin/webhooks/42/test")
      .set("x-secret", "webhook-secret")
      .send({ entityId: -1, resource: "games" })
      .expect(400);
  });

  it("should trigger webhook tests with a valid payload", async () => {
    void adminService.testWebhook.mockResolvedValue({
      entityId: 1337,
      resource: "games",
      result: { ok: true },
      webhookId: 42,
    });

    await request(getServer())
      .post("/admin/webhooks/42/test")
      .set("x-secret", "webhook-secret")
      .send({ entityId: 1337, resource: "games" })
      .expect(200);

    expect(adminService.testWebhook).toHaveBeenCalledWith(42, "games", 1337);
  });
});
