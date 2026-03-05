import { Injectable } from "@nestjs/common";

import { IgdbApiClient } from "./igdb-api.client";
import type {
  CreateIgdbWebhookInput,
  IgdbDeleteWebhookResponse,
  IgdbWebhookRecord,
  TestIgdbWebhookInput,
} from "./types/igdb-api.types";

@Injectable()
export class IgdbApiService {
  constructor(private readonly apiClient: IgdbApiClient) {}

  createWebhook(input: CreateIgdbWebhookInput): Promise<IgdbWebhookRecord> {
    const body = new URLSearchParams({
      method: input.action,
      secret: input.secret,
      url: input.url,
    });

    return this.apiClient.requestJson<IgdbWebhookRecord>(
      `/${input.resource}/webhooks/`,
      {
        body: body.toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "POST",
      },
      "createWebhook",
    );
  }

  deleteWebhook(webhookId: number): Promise<IgdbDeleteWebhookResponse> {
    return this.apiClient.requestJson<IgdbDeleteWebhookResponse>(`/webhooks/${webhookId}`, { method: "DELETE" }, "deleteWebhook");
  }

  getWebhook(webhookId: number): Promise<IgdbWebhookRecord> {
    return this.apiClient.requestJson<IgdbWebhookRecord>(`/webhooks/${webhookId}`, { method: "GET" }, "getWebhook");
  }

  listWebhooks(): Promise<IgdbWebhookRecord[]> {
    return this.apiClient.requestJson<IgdbWebhookRecord[]>("/webhooks/", { method: "GET" }, "listWebhooks");
  }

  testWebhook(input: TestIgdbWebhookInput): Promise<unknown> {
    return this.apiClient.requestJson<unknown>(
      `/${input.resource}/webhooks/test/${input.webhookId}?entityId=${input.entityId}`,
      { method: "POST" },
      "testWebhook",
    );
  }
}
