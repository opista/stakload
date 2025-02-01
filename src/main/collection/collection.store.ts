import { CollectionStoreModel } from "@contracts/database/collections";
import { Service } from "typedi";

import { createDb } from "../util/database/create-db";

@Service()
export class CollectionStore {
  private db = createDb("collections");

  async createCollection(collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) {
    return await this.db.insert<Omit<CollectionStoreModel, "_id">>(collection);
  }

  async getCollections() {
    return await this.db.find<CollectionStoreModel>({}).sort({ name: 1 });
  }

  async findCollectionById(id: string) {
    return await this.db.findOne<CollectionStoreModel>({ _id: id });
  }

  async updateCollectionById(id: string, updates: Partial<CollectionStoreModel>) {
    return await this.db.update<CollectionStoreModel>({ _id: id }, { $set: updates }, { returnUpdatedDocs: true });
  }

  async deleteCollectionById(id: string) {
    await this.db.deleteOne({ _id: id }, { multi: false });
    return true;
  }
}
