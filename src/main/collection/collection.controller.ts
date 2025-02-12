import type { CollectionStoreModel } from "@contracts/database/collections";
import { IpcHandle } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { LoggerService } from "../logger/logger.service";
import { WindowService } from "../window/window.service";
import { COLLECTION_CHANNELS } from "./collection.channels";
import { CollectionService } from "./collection.service";
@Service()
export class CollectionController extends IpcEventController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly windowService: WindowService,
    private readonly logger: LoggerService,
  ) {
    super();
  }

  @IpcHandle(COLLECTION_CHANNELS.CREATE)
  async createCollection(collection: CollectionStoreModel) {
    this.logger.debug("Creating collection", { name: collection.name });
    try {
      const created = await this.collectionService.createCollection(collection);
      this.windowService.sendEvent(EVENT_CHANNELS.COLLECTIONS_UPDATED);
      this.logger.info("Collection created", { id: created._id, name: created.name });
      return created;
    } catch (error) {
      this.logger.error("Failed to create collection", error, { name: collection.name });
      throw error;
    }
  }

  @IpcHandle(COLLECTION_CHANNELS.GET_ALL)
  async getCollections() {
    this.logger.debug("Fetching all collections");
    return this.collectionService.getCollections();
  }

  @IpcHandle(COLLECTION_CHANNELS.UPDATE)
  async updateCollection(id: string, updates: Partial<CollectionStoreModel>) {
    this.logger.debug("Updating collection", { id, updates });
    try {
      const updated = await this.collectionService.updateCollection(id, updates);

      if (updated) {
        this.windowService.sendEvent(EVENT_CHANNELS.COLLECTIONS_UPDATED);
        this.logger.info("Collection updated", { id, name: updated?.name });
      }

      return updated;
    } catch (error) {
      this.logger.error("Failed to update collection", error, { id });
      throw error;
    }
  }

  @IpcHandle(COLLECTION_CHANNELS.DELETE)
  async deleteCollection(id: string) {
    this.logger.debug("Deleting collection", { id });
    try {
      const deleted = await this.collectionService.deleteCollection(id);

      if (deleted) {
        this.windowService.sendEvent(EVENT_CHANNELS.COLLECTIONS_UPDATED);
        this.logger.info("Collection deleted", { id });
      }

      return deleted;
    } catch (error) {
      this.logger.error("Failed to delete collection", error, { id });
      throw error;
    }
  }
}
