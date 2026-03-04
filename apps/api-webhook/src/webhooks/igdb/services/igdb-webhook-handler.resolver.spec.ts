import { BadRequestException } from "@nestjs/common";
import { ModuleRef } from "@nestjs/core";
import { Mocked, TestBed } from "@suites/unit";

import { IgdbWebhookHandlerResolver } from "./igdb-webhook-handler.resolver";

describe("IgdbWebhookHandlerResolver", () => {
  let moduleRef: Mocked<ModuleRef>;
  let resolver: IgdbWebhookHandlerResolver;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(IgdbWebhookHandlerResolver).compile();

    resolver = unit;
    moduleRef = unitRef.get(ModuleRef as never);
  });

  it("should route aggregate create and update actions to the aggregate handler", async () => {
    const handler = {
      handle: vi.fn().mockResolvedValue({
        outcome: "handled",
        statusCode: 204,
      }),
    };
    moduleRef.get.mockReturnValue(handler as never);

    const payload = { id: 42, name: "Test Game" };

    await expect(resolver.resolve("games", "create", payload)).resolves.toEqual({
      outcome: "handled",
      statusCode: 204,
    });

    expect(moduleRef.get).toHaveBeenCalled();
    expect(handler.handle).toHaveBeenCalledTimes(1);
  });

  it("should route simple delete actions to the simple handler", async () => {
    const handler = {
      handle: vi.fn().mockResolvedValue({
        outcome: "handled",
        statusCode: 204,
      }),
    };
    moduleRef.get.mockReturnValue(handler as never);

    await expect(resolver.resolve("platforms", "delete", { id: 12 })).resolves.toEqual({
      outcome: "handled",
      statusCode: 204,
    });

    expect(moduleRef.get).toHaveBeenCalled();
    expect(handler.handle).toHaveBeenCalledWith(expect.anything(), 12);
  });

  it("should reject delete payloads without an integer id", async () => {
    await expect(resolver.resolve("games", "delete", {} as never)).rejects.toBeInstanceOf(BadRequestException);
    await expect(resolver.resolve("games", "delete", { id: 12.5 } as never)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it("should return 202 for valid but unsupported resources", async () => {
    await expect(resolver.resolve("age_ratings", "create", { id: 1 })).resolves.toEqual({
      outcome: "ignored_unsupported",
      statusCode: 202,
    });
  });
});
