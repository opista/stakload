import { buildManagedWebhookKey } from "./build-managed-webhook-key";

describe("buildManagedWebhookKey", () => {
  it("should build stable key values for resource and action", () => {
    expect(buildManagedWebhookKey("games", "update")).toBe("games:update");
  });
});
