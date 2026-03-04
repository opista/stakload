import { Mocked, TestBed } from "@suites/unit";

type ResponseLike = {
  status: ReturnType<typeof vi.fn>;
};

import { IgdbWebhookController } from "./igdb-webhook.controller";
import { IgdbWebhookHandlerResolver } from "./services/igdb-webhook-handler.resolver";

const createResponse = (): ResponseLike => ({
  status: vi.fn().mockReturnThis(),
});

describe("IgdbWebhookController", () => {
  let controller: IgdbWebhookController;
  let handlerResolver: Mocked<IgdbWebhookHandlerResolver>;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(IgdbWebhookController).compile();

    controller = unit;
    handlerResolver = unitRef.get(IgdbWebhookHandlerResolver);
  });

  it("should dispatch valid webhook requests and apply the returned status code", async () => {
    handlerResolver.resolve.mockResolvedValue({
      outcome: "handled",
      statusCode: 204,
    });
    const response = createResponse();
    const payload = { id: 7, name: "Platform" };

    await controller.handleWebhook(payload, "create", "platforms", response as never);

    expect(handlerResolver.resolve).toHaveBeenCalledWith("platforms", "create", payload);
    expect(response.status).toHaveBeenCalledWith(204);
  });

});
