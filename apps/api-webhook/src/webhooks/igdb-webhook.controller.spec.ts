import { Mocked, TestBed } from "@suites/unit";

type ResponseLike = {
  status: ReturnType<typeof vi.fn>;
};

import { IgdbWebhookController } from "./igdb-webhook.controller";
import { IgdbWebhookHandlerResolver } from "./services/igdb-webhook-handler.resolver";
import { WebhookGameBuildOrchestratorService } from "./services/webhook-game-build-orchestrator.service";

const createResponse = (): ResponseLike => ({
  status: vi.fn().mockReturnThis(),
});

describe("IgdbWebhookController", () => {
  let controller: IgdbWebhookController;
  let handlerResolver: Mocked<IgdbWebhookHandlerResolver>;
  let webhookGameBuildOrchestratorService: Mocked<WebhookGameBuildOrchestratorService>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(IgdbWebhookController).compile();

    controller = unit;
    handlerResolver = unitRef.get(IgdbWebhookHandlerResolver);
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
});
