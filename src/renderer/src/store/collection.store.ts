import { CollectionStoreModel } from "@contracts/database/collections";
import { CollectionActions, CollectionState } from "@contracts/store/collection";
import { create } from "zustand";

type CollectionStore = CollectionState & CollectionActions;

export const useCollectionStore = create<CollectionStore>()((set, get) => ({
  collections: [],

  createCollection: async (collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) => {
    await window.api.createCollection(collection);
    await get().fetchCollections();
  },
  deleteCollection: async (id: string) => {
    await window.api.deleteCollection(id);
    await get().fetchCollections();
  },
  fetchCollections: async () => {
    const collections = await window.api.getCollections();
    set({ collections });
  },
  updateCollection: async (id: string, updates: Pick<CollectionStoreModel, "name" | "filters" | "icon">) => {
    await window.api.updateCollection(id, updates);
    await get().fetchCollections();
  },
}));
