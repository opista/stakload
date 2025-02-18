import type { CollectionStoreModel } from "@contracts/database/collections";
import { IpcHandle } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { LoggerService } from "../logger/logger.service";
import { COLLECTION_CHANNELS } from "./collection.channels";
import { CollectionService } from "./collection.service";

@Service()
export class CollectionController extends IpcEventController {
  constructor(
    private readonly collectionService: CollectionService,
    readonly logger: LoggerService,
  ) {
    super(logger);
  }

  @IpcHandle(COLLECTION_CHANNELS.CREATE)
  async createCollection(collection: CollectionStoreModel) {
    this.logHandler(COLLECTION_CHANNELS.CREATE, { name: collection.name });
    try {
      return await this.collectionService.createCollection(collection);
    } catch (error) {
      this.logger.error("Failed to create collection", error, { name: collection.name });
      throw error;
    }
  }

  @IpcHandle(COLLECTION_CHANNELS.GET_ALL)
  async getCollections() {
    this.logHandler(COLLECTION_CHANNELS.GET_ALL);
    return this.collectionService.getCollections();
  }

  @IpcHandle(COLLECTION_CHANNELS.UPDATE)
  async updateCollection(id: string, updates: Partial<CollectionStoreModel>) {
    this.logHandler(COLLECTION_CHANNELS.UPDATE, { id, updates });
    try {
      return await this.collectionService.updateCollection(id, updates);
    } catch (error) {
      this.logger.error("Failed to update collection", error, { id });
      throw error;
    }
  }

  @IpcHandle(COLLECTION_CHANNELS.DELETE)
  async deleteCollection(id: string) {
    this.logHandler(COLLECTION_CHANNELS.DELETE, { id });
    try {
      return await this.collectionService.deleteCollection(id);
    } catch (error) {
      this.logger.error("Failed to delete collection", error, { id });
      throw error;
    }
  }
}
