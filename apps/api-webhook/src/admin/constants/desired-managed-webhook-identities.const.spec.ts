import { DESIRED_MANAGED_WEBHOOK_IDENTITIES } from "./desired-managed-webhook-identities.const";

describe("DESIRED_MANAGED_WEBHOOK_IDENTITIES", () => {
  it("should return every desired resource and action combination", () => {
    const identities = DESIRED_MANAGED_WEBHOOK_IDENTITIES;

    expect(identities.length).toBeGreaterThan(0);
    expect(identities.some((identity) => identity.resource === "games" && identity.action === "create")).toBe(true);
    expect(identities.some((identity) => identity.resource === "games" && identity.action === "update")).toBe(true);
    expect(identities.some((identity) => identity.resource === "games" && identity.action === "delete")).toBe(true);
  });
});
