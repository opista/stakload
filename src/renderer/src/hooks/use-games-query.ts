import { useEffect, useState } from "react";

export const useGamesQuery = <T>(query: () => Promise<T>) => {
  const [result, setResult] = useState<T | undefined>(undefined);

  const updateQuery = async () => {
    const response = await query();
    setResult(response);
  };

  useEffect(() => {
    updateQuery();
  }, []);

  useEffect(() => {
    const listenerId = window.api.onGamesListUpdated(() => updateQuery());
    return () => window.api.offGamesListUpdated(listenerId);
  }, [query]);

  return result;
};
