import { Mocked, TestBed } from "@suites/unit";

import { PinoLogger } from "@stakload/nestjs-logging";

import { IgdbWebhookController } from "./igdb-webhook.controller";
import { IgdbWebhookHandlerResolver } from "./services/igdb-webhook-handler.resolver";
import { WebhookGameBuildOrchestratorService } from "./services/webhook-game-build-orchestrator.service";

type ResponseLike = {
  status: ReturnType<typeof vi.fn>;
};

const createResponse = (): ResponseLike => ({
  status: vi.fn().mockReturnThis(),
});

describe("IgdbWebhookController", () => {
  let controller: IgdbWebhookController;
  let handlerResolver: Mocked<IgdbWebhookHandlerResolver>;
  let logger: Mocked<PinoLogger>;
  let webhookGameBuildOrchestratorService: Mocked<WebhookGameBuildOrchestratorService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(IgdbWebhookController).compile();

    controller = unit;
    handlerResolver = unitRef.get(IgdbWebhookHandlerResolver);
    logger = unitRef.get(PinoLogger) as unknown as Mocked<PinoLogger>;
    webhookGameBuildOrchestratorService = unitRef.get(WebhookGameBuildOrchestratorService);
  });

  it("should dispatch valid webhook requests and apply the returned status code", async () => {
    void handlerResolver.resolve.mockResolvedValue({
      outcome: "handled",
      statusCode: 204,
    });
    const response = createResponse();
    const payload = { id: 7, name: "Platform" };

    await controller.handleWebhook(payload, "create", "platforms", response as never);

    expect(handlerResolver.resolve).toHaveBeenCalledWith("platforms", "create", payload);
    expect(webhookGameBuildOrchestratorService.enqueueGameBuilds).toHaveBeenCalledWith({
      action: "create",
      outcome: "handled",
      payload,
      resource: "platforms",
    });
    expect(response.status).toHaveBeenCalledWith(204);
  });

  it("should keep the persisted webhook response status when enqueueing cache rebuilds fails", async () => {
    const enqueueError = new Error("redis unavailable");
    void handlerResolver.resolve.mockResolvedValue({
      outcome: "handled",
      statusCode: 204,
    });
    void webhookGameBuildOrchestratorService.enqueueGameBuilds.mockRejectedValueOnce(enqueueError);
    const response = createResponse();
    const payload = { id: 7, name: "Platform" };

    await expect(controller.handleWebhook(payload, "create", "platforms", response as never)).resolves.toBeUndefined();

    expect(response.status).toHaveBeenCalledWith(204);
    expect(logger.error).toHaveBeenCalledWith(
      { action: "create", err: enqueueError, igdbId: 7, resource: "platforms" },
      "Failed to enqueue game builds from webhook",
    );
  });

  it("should log enqueue failures without dereferencing a null payload", async () => {
    const enqueueError = new Error("redis unavailable");
    void handlerResolver.resolve.mockResolvedValue({
      outcome: "handled",
      statusCode: 204,
    });
    void webhookGameBuildOrchestratorService.enqueueGameBuilds.mockRejectedValueOnce(enqueueError);
    const response = createResponse();

    await expect(
      controller.handleWebhook(null as never, "create", "platforms", response as never),
    ).resolves.toBeUndefined();

    expect(response.status).toHaveBeenCalledWith(204);
    expect(logger.error).toHaveBeenCalledWith(
      { action: "create", err: enqueueError, igdbId: undefined, resource: "platforms" },
      "Failed to enqueue game builds from webhook",
    );
  });
});
