import type { CollectionStoreModel } from "@contracts/database/collections";
import { IpcController, IpcHandle } from "@electron-ipc-bridge/core";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";

import { CollectionService } from "./collection.service";

@IpcController()
@Service()
export class CollectionController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly logger: LoggerService,
  ) {}

  @IpcHandle()
  async createCollection(collection: CollectionStoreModel) {
    this.logger.info("Handling IPC message", { name: collection.name });
    try {
      return await this.collectionService.createCollection(collection);
    } catch (error) {
      this.logger.error("Failed to create collection", error, { name: collection.name });
      throw error;
    }
  }

  @IpcHandle()
  async deleteCollection(id: string) {
    this.logger.info("Handling IPC message", { id });
    try {
      return await this.collectionService.deleteCollection(id);
    } catch (error) {
      this.logger.error("Failed to delete collection", error, { id });
      throw error;
    }
  }

  @IpcHandle()
  async getCollections() {
    return this.collectionService.getCollections();
  }

  @IpcHandle()
  async updateCollection(id: string, updates: Partial<CollectionStoreModel>) {
    this.logger.info("Handling IPC message", { id, updates });
    try {
      return await this.collectionService.updateCollection(id, updates);
    } catch (error) {
      this.logger.error("Failed to update collection", error, { id });
      throw error;
    }
  }
}
