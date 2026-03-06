import type { IgdbWebhookRecord } from "../../igdb-api/types/igdb-api.types";

export const compareWebhookAge = (first: IgdbWebhookRecord, second: IgdbWebhookRecord): number => {
  const firstTimestamp = Date.parse(first.created_at);
  const secondTimestamp = Date.parse(second.created_at);

  const firstCreatedAt = Number.isNaN(firstTimestamp) ? Number.MAX_SAFE_INTEGER : firstTimestamp;
  const secondCreatedAt = Number.isNaN(secondTimestamp) ? Number.MAX_SAFE_INTEGER : secondTimestamp;

  if (firstCreatedAt !== secondCreatedAt) {
    return firstCreatedAt - secondCreatedAt;
  }

  return first.id - second.id;
};
