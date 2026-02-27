import { CollectionStoreModel } from "@contracts/database/collections";
import { Injectable } from "@nestjs/common";

import { CollectionStore } from "../collection/collection.store";
import { Logger } from "../logging/logging.service";

@Injectable()
export class CollectionService {
  constructor(
    private readonly collectionStore: CollectionStore,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async createCollection(collection: Pick<CollectionStoreModel, "filters" | "name">) {
    this.logger.debug("Processing collection creation", collection);
    try {
      const formattedName = collection.name.trim();

      const cleanFilters = Object.entries(collection.filters).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0)) {
            acc[key] = value;
          }
          return acc;
        },
        {} as Record<string, unknown>,
      );

      const created = await this.collectionStore.createCollection({
        ...collection,
        filters: cleanFilters,
        name: formattedName,
      });
      this.logger.log("Collection created successfully", {
        filters: created.filters,
        id: created._id,
        name: created.name,
      });
      return created;
    } catch (error) {
      this.logger.error("Failed to create collection", error, collection);
      throw error;
    }
  }

  async deleteCollection(id: string) {
    this.logger.debug("Processing collection deletion", { id });
    try {
      const deleted = await this.collectionStore.deleteCollectionById(id);
      if (deleted) {
        this.logger.log("Collection deleted successfully", { id });
      }
      return deleted;
    } catch (error) {
      this.logger.error("Failed to delete collection", error, { id });
      throw error;
    }
  }

  async getCollectionById(id: string) {
    this.logger.debug("Fetching collection by id", { id });
    try {
      const collection = await this.collectionStore.findCollectionById(id);
      this.logger.debug("Collection fetched successfully", { id, name: collection?.name });
      return collection;
    } catch (error) {
      this.logger.error("Failed to fetch collection", error, { id });
      throw error;
    }
  }

  async getCollections() {
    this.logger.debug("Fetching all collections");
    try {
      const collections = await this.collectionStore.getCollections();
      this.logger.debug("Collections fetched successfully", { count: collections.length });
      return collections;
    } catch (error) {
      this.logger.error("Failed to fetch collections", error);
      throw error;
    }
  }

  async updateCollection(id: string, updates: Partial<CollectionStoreModel>) {
    this.logger.debug("Processing collection update", { id, updates });
    try {
      const formattedName = updates.name?.trim();
      const updated = await this.collectionStore.updateCollectionById(id, {
        ...updates,
        ...(formattedName && { name: formattedName }),
      });
      if (updated) {
        this.logger.log("Collection updated successfully", { id, name: updated.name });
      }
      return updated;
    } catch (error) {
      this.logger.error("Failed to update collection", error, { id });
      throw error;
    }
  }
}
