import { isValidWebhookRecord } from "./is-valid-webhook-record";

describe("isValidWebhookRecord", () => {
  it("should return true for a record with numeric id and string url", () => {
    expect(
      isValidWebhookRecord({
        active: true,
        api_key: "client-id",
        category: 8,
        created_at: 1772794546,
        id: 42,
        secret: "secret",
        sub_category: 2,
        updated_at: 1772794546,
        url: "https://example.com/webhooks/games/update",
      }),
    ).toBe(true);
  });

  it("should return false for null and non-object values", () => {
    expect(isValidWebhookRecord(null)).toBe(false);
    expect(isValidWebhookRecord("value")).toBe(false);
    expect(isValidWebhookRecord(42)).toBe(false);
  });

  it("should return false when id or url is missing or invalid", () => {
    expect(isValidWebhookRecord({ url: "https://example.com" })).toBe(false);
    expect(isValidWebhookRecord({ id: 42 })).toBe(false);
    expect(isValidWebhookRecord({ id: "42", url: "https://example.com" })).toBe(false);
    expect(isValidWebhookRecord({ id: 42, url: 1234 })).toBe(false);
  });
});
