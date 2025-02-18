import { CollectionStoreModel } from "@contracts/database/collections";

export type CollectionState = {
  collections: CollectionStoreModel[];
};

export type CollectionActions = {
  createCollection: (collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  fetchCollections: () => Promise<void>;
  updateCollection: (id: string, updates: Pick<CollectionStoreModel, "name" | "filters" | "icon">) => Promise<void>;
};
