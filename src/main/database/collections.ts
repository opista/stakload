import { CollectionStoreModel } from "@contracts/database/collections";

import { createDb } from "./util/create-db";

const db = createDb("collections");

export const addCollection = async (collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">) => {
  return await db.insert<Omit<CollectionStoreModel, "_id">>(collection);
};

export const getAllCollections = async () => {
  return await db.find<CollectionStoreModel>({}).sort({ name: 1 });
};

export const findCollectionById = async (id: string) => {
  return await db.findOne<CollectionStoreModel>({ _id: id });
};

export const updateCollectionById = async (
  id: string,
  updates: Pick<CollectionStoreModel, "icon" | "name" | "filters">,
) => {
  return await db.update<CollectionStoreModel>({ _id: id }, { $set: updates }, { returnUpdatedDocs: true });
};

export const removeCollectionById = async (id: string) => {
  await db.deleteOne({ _id: id }, { multi: false });
  return true;
};
