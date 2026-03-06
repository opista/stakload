import { buildManagedWebhookUrl } from "./build-managed-webhook-url";

describe("buildManagedWebhookUrl", () => {
  it("should build managed urls using the simplified callback shape", () => {
    expect(buildManagedWebhookUrl("https://hooks.example.com", "games", "create")).toBe(
      "https://hooks.example.com/webhooks/games/create",
    );
  });
});
