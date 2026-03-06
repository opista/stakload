import type { WebhookAction, WebhookResource } from "../../webhooks/types/igdb-webhook.types";

export class WebhookDto {
  action!: WebhookAction | null;
  active!: boolean;
  category!: number;
  createdAt!: number;
  id!: number;
  managedByService!: boolean;
  resource!: WebhookResource | null;
  subCategory!: number;
  supportedByService!: boolean;
  updatedAt!: number;
  url!: string;
}
