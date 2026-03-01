import { CollectionStoreModel } from "../database/collections";

export type CollectionState = {
  collections: CollectionStoreModel[];
};

export type CollectionActions = {
  createCollection: (collection: Pick<CollectionStoreModel, "filters" | "name">) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  fetchCollections: () => Promise<void>;
  updateCollection: (id: string, updates: Pick<CollectionStoreModel, "filters" | "name">) => Promise<void>;
};
