import { compareWebhookAge } from "./compare-webhook-age";

describe("compareWebhookAge", () => {
  it("should sort older records before newer records", () => {
    const older = {
      active: true,
      api_key: "client-id",
      category: 1,
      created_at: "2026-03-01T00:00:00.000Z",
      id: 1,
      secret: "secret",
      sub_category: 1,
      updated_at: "2026-03-01T00:00:00.000Z",
      url: "https://hooks.example.com/webhooks/games/update",
    };
    const newer = {
      ...older,
      created_at: "2026-03-02T00:00:00.000Z",
      id: 2,
    };

    expect(compareWebhookAge(older, newer)).toBeLessThan(0);
  });

  it("should use id as tie-breaker", () => {
    const first = {
      active: true,
      api_key: "client-id",
      category: 1,
      created_at: "2026-03-01T00:00:00.000Z",
      id: 1,
      secret: "secret",
      sub_category: 1,
      updated_at: "2026-03-01T00:00:00.000Z",
      url: "https://hooks.example.com/webhooks/games/update",
    };
    const second = {
      ...first,
      id: 2,
    };

    expect(compareWebhookAge(first, second)).toBeLessThan(0);
  });
});
