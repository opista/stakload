import Dexie from "dexie";
import games, { GameEntityTable } from "./schema/games";

const db = new Dexie("trulaunch") as Dexie & {
  games: GameEntityTable;
};

// Schema declaration:
db.version(1).stores({
  games,
});

export { db };
