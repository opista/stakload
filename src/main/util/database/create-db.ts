import { app } from "electron";
import Datastore from "nedb-promises";
import path from "path";

export const createDb = (name: string) =>
  Datastore.create({
    autoload: true,
    compareStrings: (a, b) => a.toLowerCase().localeCompare(b.toLowerCase()),
    // filename: join(DATABASE_PATH, `${name}.db`),
    filename: path.join(app.getPath("userData"), "databases", `${name}.db`),
    timestampData: true,
  });
