import { useEffect, useState } from "react";

export const useGamesQuery = <T>(query: () => Promise<T>, dependencies: unknown[] = []) => {
  const [result, setResult] = useState<T | undefined>(undefined);

  const updateQuery = async () => {
    const response = await query();
    setResult(response);
  };

  useEffect(() => {
    updateQuery();
  }, [...dependencies]);

  useEffect(() => {
    const removeListener = window.api.onGamesListUpdated(() => updateQuery());
    return () => removeListener();
  }, [query]);

  return result;
};
