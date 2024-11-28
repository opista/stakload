import { useState, useEffect } from "react";

export const useGameSync = () => {
  const [processing, setProcessing] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const removeListener = window.api.onSyncInserted((_event, count) => {
      setTotal((prev) => prev + count);
      if (!processing) {
        setProcessing(1);
      }
    });

    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncProcessed(async (_event) => setProcessing((prev) => prev + 1));
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncComplete(() => {
      setProcessing(0);
      setTotal(0);
    });

    return () => removeListener();
  }, []);

  return { processing, total };
};
