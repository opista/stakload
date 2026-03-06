import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export interface IgdbOAuthTokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export interface IgdbWebhookRecord {
  active: boolean;
  api_key: string;
  category: number;
  created_at: number;
  id: number;
  secret: string;
  sub_category: number;
  updated_at: number;
  url: string;
}

export interface CreateIgdbWebhookInput {
  action: WebhookAction;
  resource: WebhookResource;
  secret: string;
  url: string;
}

export interface TestIgdbWebhookInput {
  entityId: number;
  resource: WebhookResource;
  webhookId: number;
}

export type IgdbCreateWebhookResponse = IgdbWebhookRecord[] | IgdbWebhookRecord;
export type IgdbDeleteWebhookResponse = IgdbWebhookRecord[] | IgdbWebhookRecord;

export class IgdbApiError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly body: unknown,
  ) {
    super(message);
    this.name = "IgdbApiError";
  }
}
