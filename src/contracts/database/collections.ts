import { GameFilters } from "./games";

export type CollectionStoreModel = {
  _id: string;
  name: string;
  filters: GameFilters;
};
