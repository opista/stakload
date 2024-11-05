import { RxJsonSchema } from "rxdb";

export type GameStoreModel = {
  _id: string;
  appId: string;
  name: string;
  platform: string;
};

export const gameSchema: RxJsonSchema<GameStoreModel> = {
  title: "Game schema",
  version: 0,
  description: "describes a simple hero",
  primaryKey: "_id",
  type: "object",
  properties: {
    _id: {
      type: "string",
      maxLength: 100,
    },
    appId: {
      type: "string",
    },
    name: {
      type: "string",
    },
    platform: {
      type: "string",
    },
  },
  required: ["_id", "appId", "name", "platform"],
} as const;
