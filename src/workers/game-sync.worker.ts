import { exposeWorker } from "react-hooks-worker";
import { db, GameStoreModel } from "../database";

export type GameSyncResult = {
  status: "PROCESSING" | "COMPLETE";
  processed: number;
  total: number;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function* gameSync({
  games = [],
}: {
  games: GameStoreModel[];
}): AsyncGenerator<GameSyncResult> {
  let processed = 0;
  const total = games?.length;

  if (!total) return;

  while (processed < total) {
    yield { status: "PROCESSING", processed, total };

    await db.games.update(games[processed].id, {
      metadataSyncedAt: new Date(),
    });

    await sleep(10000);

    processed += 1;
  }

  yield { status: "COMPLETE", processed, total };
}

exposeWorker(gameSync);
