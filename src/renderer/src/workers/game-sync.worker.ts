import { GameStoreModel } from "@database/schema/games";
import { exposeWorker } from "react-hooks-worker";

export type GameSyncInput = {
  games: GameStoreModel[];
  processing: number;
  total: number;
};

export type GameSyncResult = {
  status: "PROCESSING" | "COMPLETE";
  processing: number;
  total: number;
};

async function* gameSync(games: GameStoreModel[]): AsyncGenerator<GameSyncResult> {
  if (!games.length) return;

  let idx = 0;

  while (idx < games.length) {
    yield { status: "PROCESSING", processing: idx + 1, total: games.length };
    // await sleep(5000);

    // const game = games[idx];

    // TODO, figure out how to access window context vars for request
    // const appDetails = await getAppDetails(game.gameId);
    // const mapped = mapAppDetailsToGameStoreModel(game, appDetails);

    // await db.games.update(game.id, {
    //   ...mapped,
    //   metadataSyncedAt: new Date(),
    // });

    idx++;
  }

  yield { status: "COMPLETE", processing: idx + 1, total: games.length };
}

exposeWorker(gameSync);
