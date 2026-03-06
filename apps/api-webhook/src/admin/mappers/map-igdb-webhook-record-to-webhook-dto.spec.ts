import { mapIgdbWebhookRecordToWebhookDto } from "./map-igdb-webhook-record-to-webhook-dto";

describe("mapIgdbWebhookRecordToWebhookDto", () => {
  const baseWebhook = {
    active: true,
    api_key: "client-id",
    category: 8,
    created_at: 1772668800,
    id: 42,
    secret: "webhook-secret",
    sub_category: 2,
    updated_at: 1772668800,
  };

  it("should map a managed webhook", () => {
    const result = mapIgdbWebhookRecordToWebhookDto(
      {
        ...baseWebhook,
        url: "https://hooks.example.com/webhooks/games/update",
      },
      "https://hooks.example.com",
    );

    expect(result).toEqual({
      action: "update",
      active: true,
      category: 8,
      createdAt: 1772668800,
      id: 42,
      managedByService: true,
      resource: "games",
      subCategory: 2,
      supportedByService: true,
      updatedAt: 1772668800,
      url: "https://hooks.example.com/webhooks/games/update",
    });
  });

  it("should leave managed metadata empty for non-managed urls", () => {
    const result = mapIgdbWebhookRecordToWebhookDto(
      {
        ...baseWebhook,
        url: "https://legacy.example.com/igdb",
      },
      "https://hooks.example.com",
    );

    expect(result).toEqual({
      action: null,
      active: true,
      category: 8,
      createdAt: 1772668800,
      id: 42,
      managedByService: false,
      resource: null,
      subCategory: 2,
      supportedByService: false,
      updatedAt: 1772668800,
      url: "https://legacy.example.com/igdb",
    });
  });
});
