import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export class WebhookDto {
  action!: WebhookAction | null;
  active!: boolean;
  apiKey!: string;
  category!: number;
  createdAt!: string;
  id!: number;
  managedByService!: boolean;
  resource!: WebhookResource | null;
  secret!: string;
  subCategory!: number;
  supportedByService!: boolean;
  updatedAt!: string;
  url!: string;
}
