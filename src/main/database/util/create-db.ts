import { app } from "electron";
import Datastore from "nedb-promises";
import path from "path";

type DatastoreCreateParams = Parameters<typeof Datastore.create>;
type DatastoreOptions = Omit<DatastoreCreateParams[0], "string">;

export const createDb = (name: string, datastoreOptions?: DatastoreOptions) => {
  return Datastore.create({
    ...datastoreOptions,
    autoload: true,
    filename: path.join(app.getPath("userData"), "databases", `${name}.db`),
    compareStrings: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
    timestampData: true,
  });
};
