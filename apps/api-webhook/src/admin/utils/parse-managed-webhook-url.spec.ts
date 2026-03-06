import { parseManagedWebhookUrl } from "./parse-managed-webhook-url";

describe("parseManagedWebhookUrl", () => {
  it("should parse managed webhook urls that match the exact route shape", () => {
    expect(
      parseManagedWebhookUrl("https://hooks.example.com/webhooks/games/update", "https://hooks.example.com"),
    ).toEqual({
      action: "update",
      resource: "games",
    });
  });

  it("should reject malformed, partial, or non-matching managed urls", () => {
    expect(parseManagedWebhookUrl("https://hooks.example.com/webhooks/games", "https://hooks.example.com")).toBeNull();
    expect(
      parseManagedWebhookUrl("https://hooks.example.com/webhooks/games/update/extra", "https://hooks.example.com"),
    ).toBeNull();
    expect(
      parseManagedWebhookUrl("https://hooks.example.com/webhooks/unknown/update", "https://hooks.example.com"),
    ).toBeNull();
    expect(
      parseManagedWebhookUrl("https://legacy.example.com/webhooks/games/update", "https://hooks.example.com"),
    ).toBeNull();
  });
});
