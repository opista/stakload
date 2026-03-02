import type { IgdbRawEntity, IgdbResourceName } from "./resources";

export const IGDB_WEBHOOK_ACTIONS = ["create", "delete", "update"] as const;

export type IgdbWebhookAction = (typeof IGDB_WEBHOOK_ACTIONS)[number];

export type IgdbWebhookEvent<
  TResource extends IgdbResourceName = IgdbResourceName,
  TEntity extends IgdbRawEntity = IgdbRawEntity,
> = {
  action: IgdbWebhookAction;
  payload: TEntity | Pick<TEntity, "id">;
  resource: TResource;
  receivedAt: string;
};

export type IgdbWebhookDeletePayload = {
  id: number;
};

export const isIgdbWebhookDeletePayload = (payload: unknown): payload is IgdbWebhookDeletePayload => {
  if (typeof payload !== "object" || payload === null) {
    return false;
  }

  return "id" in payload && typeof payload.id === "number";
};
