import { CollectionStoreModel } from "@contracts/database/collections";
import { IpcMainInvokeEvent } from "electron";

import { BaseController } from "../util/base.controller";
import { IpcHandle } from "../util/ipc.decorator";
import { COLLECTION_CHANNELS } from "./collection.channels";
import { CollectionService } from "./collection.service";

export class CollectionController extends BaseController {
  constructor(private readonly collectionService: CollectionService) {
    super();
  }

  @IpcHandle(COLLECTION_CHANNELS.CREATE)
  async createCollection(_event: IpcMainInvokeEvent, collection: CollectionStoreModel) {
    return this.collectionService.createCollection(collection);
  }

  @IpcHandle(COLLECTION_CHANNELS.GET_ALL)
  async getCollections(_event: IpcMainInvokeEvent) {
    return this.collectionService.getCollections();
  }

  @IpcHandle(COLLECTION_CHANNELS.UPDATE)
  async updateCollection(_event: IpcMainInvokeEvent, id: string, updates: Partial<CollectionStoreModel>) {
    return this.collectionService.updateCollection(id, updates);
  }

  @IpcHandle(COLLECTION_CHANNELS.DELETE)
  async deleteCollection(_event: IpcMainInvokeEvent, id: string) {
    return this.collectionService.deleteCollection(id);
  }
}
