import { Mocked, TestBed } from "@suites/unit";

import { IgdbApiClient } from "./igdb-api.client";
import { IgdbApiService } from "./igdb-api.service";

describe("IgdbApiService", () => {
  let apiClient: Mocked<IgdbApiClient>;
  let service: IgdbApiService;

  beforeEach(async () => {
    const { unit, unitRef } = await TestBed.solitary(IgdbApiService).compile();

    service = unit;
    apiClient = unitRef.get(IgdbApiClient);
  });

  it("should call the webhook list endpoint", async () => {
    void apiClient.requestJson.mockResolvedValue([]);

    await service.listWebhooks();

    expect(apiClient.requestJson).toHaveBeenCalledWith("/webhooks/", { method: "GET" }, "listWebhooks");
  });

  it("should send a form encoded body when creating a webhook", async () => {
    void apiClient.requestJson.mockResolvedValue({
      active: true,
      api_key: "client-id",
      category: 1,
      created_at: "2026-03-04T00:00:00.000Z",
      id: 1,
      secret: "secret",
      sub_category: 2,
      updated_at: "2026-03-04T00:00:00.000Z",
      url: "https://example.com",
    });

    await service.createWebhook({
      action: "update",
      resource: "games",
      secret: "secret",
      url: "https://example.com",
    });

    expect(apiClient.requestJson).toHaveBeenCalledWith(
      "/games/webhooks/",
      {
        body: "method=update&secret=secret&url=https%3A%2F%2Fexample.com",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      },
      "createWebhook",
    );
  });
});
