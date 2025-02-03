import type { CollectionStoreModel } from "@contracts/database/collections";
import { IpcHandle } from "@util/ipc/ipc.decorator";
import { IpcEventController } from "@util/ipc/ipc-event.controller";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { WindowService } from "../window/window.service";
import { COLLECTION_CHANNELS } from "./collection.channels";
import { CollectionService } from "./collection.service";

@Service()
export class CollectionController extends IpcEventController {
  constructor(
    private readonly collectionService: CollectionService,
    private readonly windowService: WindowService,
  ) {
    super();
  }

  @IpcHandle(COLLECTION_CHANNELS.CREATE)
  async createCollection(collection: CollectionStoreModel) {
    const created = await this.collectionService.createCollection(collection);
    this.windowService.sendEvent(EVENT_CHANNELS.COLLECTIONS_UPDATED);
    return created;
  }

  @IpcHandle(COLLECTION_CHANNELS.GET_ALL)
  async getCollections() {
    return this.collectionService.getCollections();
  }

  @IpcHandle(COLLECTION_CHANNELS.UPDATE)
  async updateCollection(id: string, updates: Partial<CollectionStoreModel>) {
    const updated = await this.collectionService.updateCollection(id, updates);
    this.windowService.sendEvent(EVENT_CHANNELS.COLLECTIONS_UPDATED);
    return updated;
  }

  @IpcHandle(COLLECTION_CHANNELS.DELETE)
  async deleteCollection(id: string) {
    const deleted = await this.collectionService.deleteCollection(id);
    this.windowService.sendEvent(EVENT_CHANNELS.COLLECTIONS_UPDATED);
    return deleted;
  }
}
