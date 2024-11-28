import { useState, useEffect } from "react";

export const useGameSync = () => {
  const [processing, setProcessing] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const listenerId = window.api.onSyncInserted((_event, count) => {
      setTotal((prev) => prev + count);
      if (!processing) {
        setProcessing(1);
      }
    });

    return () => window.api.offSyncInserted(listenerId);
  }, []);

  useEffect(() => {
    const listenerId = window.api.onSyncProcessed(async (_event) => setProcessing((prev) => prev + 1));
    return () => window.api.offSyncProcessed(listenerId);
  }, []);

  useEffect(() => {
    const listenerId = window.api.onSyncComplete(() => {
      setProcessing(0);
      setTotal(0);
    });

    return () => window.api.offSyncComplete(listenerId);
  }, []);

  return { processing, total };
};
