import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { CollectionStoreModel } from "@stakload/contracts/database/collections";

import { Logger } from "../logging/logging.service";
import { CollectionEntity } from "./collection.entity";

@Injectable()
export class CollectionStore {
  constructor(
    @InjectRepository(CollectionEntity)
    private readonly repository: Repository<CollectionEntity>,
    private readonly logger: Logger,
  ) {
    this.logger.setContext(this.constructor.name);
  }

  async createCollection(collection: Pick<CollectionStoreModel, "name" | "filters">) {
    this.logger.debug("Attempting to create collection in database", collection);
    try {
      const created = this.repository.create(collection);
      await this.repository.save(created);
      this.logger.debug("Collection created in database", {
        id: created._id,
        name: created.name,
      });
      return created;
    } catch (error) {
      this.logger.error("Database error while creating collection", error, collection);
      throw error;
    }
  }

  async deleteCollectionById(id: string) {
    this.logger.debug("Deleting collection from database", { id });
    try {
      await this.repository.delete(id);
      this.logger.debug("Collection deleted from database", { id });
      return true;
    } catch (error) {
      this.logger.error("Database error while deleting collection", error, {
        id,
      });
      throw error;
    }
  }

  async findCollectionById(id: string) {
    this.logger.debug("Finding collection by id in database", { id });
    try {
      const collection = await this.repository.findOneBy({ _id: id });
      if (!collection) {
        this.logger.warn("Collection not found in database", { id });
      }
      return collection;
    } catch (error) {
      this.logger.error("Database error while finding collection", error, {
        id,
      });
      throw error;
    }
  }

  async getCollections() {
    this.logger.debug("Fetching all collections from database");
    try {
      const collections = await this.repository.find({
        order: { name: "ASC" },
      });
      this.logger.debug("Collections fetched from database", {
        count: collections.length,
      });
      return collections;
    } catch (error) {
      this.logger.error("Database error while fetching collections", error);
      throw error;
    }
  }

  async updateCollectionById(id: string, updates: Partial<CollectionStoreModel>) {
    this.logger.debug("Updating collection in database", { id, updates });
    try {
      await this.repository.update(id, updates);
      const updated = await this.repository.findOneBy({ _id: id });
      if (updated) {
        this.logger.debug("Collection updated in database", { id });
      }
      return updated;
    } catch (error) {
      this.logger.error("Database error while updating collection", error, {
        id,
      });
      throw error;
    }
  }
}
