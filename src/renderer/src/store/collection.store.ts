import { CollectionActions, CollectionState } from "@contracts/store/collection";
import { create } from "zustand";

import { CollectionStoreModel } from "../ipc.types";

type CollectionStore = CollectionState & CollectionActions;

export const useCollectionStore = create<CollectionStore>()((set, get) => ({
  collections: [],

  createCollection: async (collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) => {
    await window.ipc.collection.createCollection(collection as CollectionStoreModel);
    await get().fetchCollections();
  },
  deleteCollection: async (id: string) => {
    await window.ipc.collection.deleteCollection(id);
    await get().fetchCollections();
  },
  fetchCollections: async () => {
    const collections = await window.ipc.collection.getCollections();
    set({ collections: collections as any });
  },
  updateCollection: async (id: string, updates: Pick<CollectionStoreModel, "name" | "filters" | "icon">) => {
    await window.ipc.collection.updateCollection(id, updates);
    await get().fetchCollections();
  },
}));
