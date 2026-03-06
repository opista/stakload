import { IgdbApiError } from "../../igdb-api/types/igdb-api.types";
import { buildWebhookOperationError } from "./build-webhook-operation-error";

describe("buildWebhookOperationError", () => {
  it("should include status code for igdb api errors", () => {
    const result = buildWebhookOperationError({
      action: "update",
      error: new IgdbApiError("Conflict", 409, {}),
      operation: "create",
      resource: "games",
      webhookId: null,
    });

    expect(result).toEqual({
      action: "update",
      message: "Conflict",
      operation: "create",
      resource: "games",
      statusCode: 409,
      webhookId: null,
    });
  });

  it("should default status code to null for non-igdb errors", () => {
    const result = buildWebhookOperationError({
      action: null,
      error: new Error("Boom"),
      operation: "delete",
      resource: null,
      webhookId: 42,
    });

    expect(result.statusCode).toBeNull();
    expect(result.message).toBe("Boom");
  });
});
