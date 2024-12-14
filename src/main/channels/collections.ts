import { CollectionStoreModel } from "@contracts/database/collections";
import { IpcMainInvokeEvent } from "electron";

import { addCollection, getAllCollections, removeCollectionById, updateCollectionById } from "../database/collections";

export const createCollection = (
  _event: IpcMainInvokeEvent,
  collection: Pick<CollectionStoreModel, "name" | "filters">,
) => addCollection(collection);

export const getCollections = (_event: IpcMainInvokeEvent) => getAllCollections();

export const updateCollection = (
  _event: IpcMainInvokeEvent,
  id: string,
  updates: Pick<CollectionStoreModel, "name" | "filters">,
) => updateCollectionById(id, updates);

export const deleteCollection = (_event: IpcMainInvokeEvent, id: string) => removeCollectionById(id);
