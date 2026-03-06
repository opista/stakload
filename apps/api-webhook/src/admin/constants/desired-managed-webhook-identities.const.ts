import { RESOURCE_DEFINITION_MAP } from "../../webhooks/resource-definitions/igdb-resource-definitions";
import { WEBHOOK_ACTIONS } from "../../webhooks/types/igdb-webhook.types";
import type { ManagedWebhookIdentity } from "../utils/managed-webhook-identity";

const resources = [...RESOURCE_DEFINITION_MAP.keys()];

export const DESIRED_MANAGED_WEBHOOK_IDENTITIES: ManagedWebhookIdentity[] = resources.flatMap((resource) =>
  WEBHOOK_ACTIONS.map((action) => ({ action, resource })),
);
