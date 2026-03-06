import type { IgdbWebhookRecord } from "../types/igdb-api.types";

export const isValidWebhookRecord = (value: unknown): value is IgdbWebhookRecord => {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if ("id" in value === false || "url" in value === false) {
    return false;
  }

  return typeof value.id === "number" && typeof value.url === "string";
};
