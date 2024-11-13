import { exposeWorker } from "react-hooks-worker";

async function* gameSync(ids: string[]) {
  const total = ids.length;
  let processed = 0;

  while (processed < total) {
    console.log("processing", ids[processed]);
    processed++;
    yield { state: "PENDING", processed, total };
  }

  yield { state: "COMPLETE", processed, total };
}

exposeWorker(gameSync);
