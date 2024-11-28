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
    const removeListener = window.api.onGamesListUpdated(() => updateQuery());
    return () => removeListener();
  }, [query]);

  return result;
};
