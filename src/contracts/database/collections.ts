import { GameFilters } from "./games";

export type CollectionStoreModel = {
  _id: string;
  filters: GameFilters;
  name: string;
};
