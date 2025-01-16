import { GameStoreModel } from "./games";

export type CollectionStoreModel = {
  _id: string;
  filters: Record<keyof GameStoreModel, string[]>;
  name: string;
};
