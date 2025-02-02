import { CollectionStoreModel } from "@contracts/database/collections";
import { Service } from "typedi";

import { createDb } from "../util/database/create-db";

const db = createDb("collections");

@Service({ global: true })
export class CollectionStore {
  async createCollection(collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) {
    return await db.insert<Omit<CollectionStoreModel, "_id">>(collection);
  }

  async getCollections() {
    return await db.find<CollectionStoreModel>({}).sort({ name: 1 });
  }

  async findCollectionById(id: string) {
    return await db.findOne<CollectionStoreModel>({ _id: id });
  }

  async updateCollectionById(id: string, updates: Partial<CollectionStoreModel>) {
    return await db.update<CollectionStoreModel>({ _id: id }, { $set: updates }, { returnUpdatedDocs: true });
  }

  async deleteCollectionById(id: string) {
    await db.deleteOne({ _id: id }, { multi: false });
    return true;
  }
}
