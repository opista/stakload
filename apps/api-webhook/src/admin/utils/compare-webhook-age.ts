import type { IgdbWebhookRecord } from "../../igdb-api/types/igdb-api.types";

export const compareWebhookAge = (first: IgdbWebhookRecord, second: IgdbWebhookRecord): number => {
  if (first.created_at !== second.created_at) {
    return first.created_at - second.created_at;
  }

  return first.id - second.id;
};
