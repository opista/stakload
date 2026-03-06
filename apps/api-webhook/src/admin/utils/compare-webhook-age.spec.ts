import { compareWebhookAge } from "./compare-webhook-age";

describe("compareWebhookAge", () => {
  it("should sort older epoch records before newer records", () => {
    const older = {
      active: true,
      api_key: "client-id",
      category: 1,
      created_at: 1_772_700_000,
      id: 1,
      secret: "secret",
      sub_category: 1,
      updated_at: 1_772_700_000,
      url: "https://hooks.example.com/webhooks/games/update",
    };
    const newer = {
      ...older,
      created_at: 1_772_800_000,
      id: 2,
    };

    expect(compareWebhookAge(older, newer)).toBeLessThan(0);
  });

  it("should use id as tie-breaker", () => {
    const first = {
      active: true,
      api_key: "client-id",
      category: 1,
      created_at: 1_772_700_000,
      id: 1,
      secret: "secret",
      sub_category: 1,
      updated_at: 1_772_700_000,
      url: "https://hooks.example.com/webhooks/games/update",
    };
    const second = {
      ...first,
      id: 2,
    };

    expect(compareWebhookAge(first, second)).toBeLessThan(0);
  });
});
