import { CollectionStoreModel } from "@contracts/database/collections";
import { createDb } from "@util/database/create-db";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

const db = createDb("collections");

@Service({ global: true })
export class CollectionStore {
  constructor(private readonly logger: LoggerService) {}

  async createCollection(collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) {
    this.logger.debug("Attempting to create collection in database", collection);
    try {
      const created = await db.insert<Omit<CollectionStoreModel, "_id">>(collection);
      this.logger.debug("Collection created in database", { id: created._id, name: created.name });
      return created;
    } catch (error) {
      this.logger.error("Database error while creating collection", error, collection);
      throw error;
    }
  }

  async deleteCollectionById(id: string) {
    this.logger.debug("Deleting collection from database", { id });
    try {
      await db.deleteOne({ _id: id }, { multi: false });
      this.logger.debug("Collection deleted from database", { id });
      return true;
    } catch (error) {
      this.logger.error("Database error while deleting collection", error, { id });
      throw error;
    }
  }

  async findCollectionById(id: string) {
    this.logger.debug("Finding collection by id in database", { id });
    try {
      const collection = await db.findOne<CollectionStoreModel>({ _id: id });
      if (!collection) {
        this.logger.warn("Collection not found in database", { id });
      }
      return collection;
    } catch (error) {
      this.logger.error("Database error while finding collection", error, { id });
      throw error;
    }
  }

  async getCollections() {
    this.logger.debug("Fetching all collections from database");
    try {
      const collections = await db.find<CollectionStoreModel>({}).sort({ name: 1 });
      this.logger.debug("Collections fetched from database", { count: collections.length });
      return collections;
    } catch (error) {
      this.logger.error("Database error while fetching collections", error);
      throw error;
    }
  }

  async updateCollectionById(id: string, updates: Partial<CollectionStoreModel>) {
    this.logger.debug("Updating collection in database", { id, updates });
    try {
      const updated = await db.update<CollectionStoreModel>(
        { _id: id },
        { $set: updates },
        { returnUpdatedDocs: true },
      );
      if (updated) {
        this.logger.debug("Collection updated in database", { id });
      }
      return updated;
    } catch (error) {
      this.logger.error("Database error while updating collection", error, { id });
      throw error;
    }
  }
}
