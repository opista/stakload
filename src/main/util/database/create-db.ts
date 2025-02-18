import Datastore from "nedb-promises";
import path from "path";

import { DATABASE_PATH } from "../../constants";

export const createDb = (name: string) =>
  Datastore.create({
    autoload: true,
    compareStrings: (a, b) => a.toLocaleLowerCase().localeCompare(b.toLocaleLowerCase()),
    filename: path.join(DATABASE_PATH, `${name}.db`),
    timestampData: true,
  });
