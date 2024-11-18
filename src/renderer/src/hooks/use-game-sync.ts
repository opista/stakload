import { db } from "@database/index";
import { useState, useEffect } from "react";
import { mapAppDetailsToGameStoreModel } from "../libraries/steam/util/map-app-details-to-game-store-model";

export const useGameSync = () => {
  const [processing, setProcessing] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    window.api.onSyncInserted((_event, count) => {
      setTotal((prev) => prev + count);

      if (!processing) {
        setProcessing(1);
      }
    });

    return () => window.api.offSyncInserted();
  }, []);

  useEffect(() => {
    window.api.onSyncProcessed(async (_event, { id, appDetails }) => {
      // TODO - let's offload database updates entirely to backend
      const mapped = mapAppDetailsToGameStoreModel(appDetails);
      await db.games.update(id, { ...mapped, metadataSyncedAt: new Date() });

      setProcessing((prev) => prev + 1);
    });

    return () => window.api.offSyncProcessed();
  }, []);

  useEffect(() => {
    window.api.onSyncComplete(() => {
      setProcessing(0);
      setTotal(0);
    });

    return () => window.api.offSyncComplete();
  }, []);

  return { processing, total };
};
