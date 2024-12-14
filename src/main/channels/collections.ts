import { CollectionStoreModel } from "@contracts/database/collections";
import { IpcMainInvokeEvent, WebContents } from "electron";

import { EVENT_COLLECTIONS_LIST_UPDATED } from "../../preload/channels";
import { addCollection, getAllCollections, removeCollectionById, updateCollectionById } from "../database/collections";

export const createCollection =
  (contents: WebContents) =>
  async (_event: IpcMainInvokeEvent, collection: Pick<CollectionStoreModel, "name" | "filters">) => {
    const created = await addCollection(collection);
    contents.send(EVENT_COLLECTIONS_LIST_UPDATED);
    return created;
  };

export const getCollections = (_event: IpcMainInvokeEvent) => getAllCollections();

export const updateCollection =
  (contents: WebContents) =>
  async (_event: IpcMainInvokeEvent, id: string, updates: Pick<CollectionStoreModel, "name" | "filters">) => {
    const updated = await updateCollectionById(id, updates);
    contents.send(EVENT_COLLECTIONS_LIST_UPDATED);

    return updated;
  };

export const deleteCollection = (contents: WebContents) => async (_event: IpcMainInvokeEvent, id: string) => {
  const removed = await removeCollectionById(id);
  contents.send(EVENT_COLLECTIONS_LIST_UPDATED);

  return removed;
};
