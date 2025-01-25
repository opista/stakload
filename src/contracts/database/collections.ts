import { GameFilters } from "./games";

export type CollectionStoreModel = {
  _id: string;
  filters: GameFilters;
  icon?: string;
  name: string;
};
