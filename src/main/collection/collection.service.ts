import { CollectionStoreModel } from "@contracts/database/collections";
import { Service } from "typedi";

import { CollectionStore } from "../collection/collection.store";

@Service()
export class CollectionService {
  constructor(private readonly collectionStore: CollectionStore) {}

  async createCollection(collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) {
    return await this.collectionStore.createCollection(collection);
  }

  async getCollections() {
    return await this.collectionStore.getCollections();
  }

  async updateCollection(id: string, updates: Partial<CollectionStoreModel>) {
    return await this.collectionStore.updateCollectionById(id, updates);
  }

  async deleteCollection(id: string) {
    return await this.collectionStore.deleteCollectionById(id);
  }
}
