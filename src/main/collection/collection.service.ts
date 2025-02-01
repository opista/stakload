import { CollectionStoreModel } from "@contracts/database/collections";
import { BrowserWindow } from "electron";
import { Service } from "typedi";

import { EVENT_CHANNELS } from "../../preload/channels";
import { CollectionStore } from "../collection/collection.store";

@Service()
export class CollectionService {
  constructor(
    private readonly collectionStore: CollectionStore,
    private readonly window: BrowserWindow,
  ) {}

  async createCollection(collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) {
    const created = await this.collectionStore.createCollection(collection);
    this.window.webContents.send(EVENT_CHANNELS.COLLECTIONS_UPDATED);
    return created;
  }

  async getCollections() {
    return await this.collectionStore.getCollections();
  }

  async updateCollection(id: string, updates: Partial<CollectionStoreModel>) {
    const updated = await this.collectionStore.updateCollectionById(id, updates);
    this.window.webContents.send(EVENT_CHANNELS.COLLECTIONS_UPDATED);
    return updated;
  }

  async deleteCollection(id: string) {
    const removed = await this.collectionStore.deleteCollectionById(id);
    this.window.webContents.send(EVENT_CHANNELS.COLLECTIONS_UPDATED);
    return removed;
  }
}
