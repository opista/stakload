import { useEffect, useState } from "react";

export const useGamesQuery = <T>(query: () => Promise<T>, dependencies: unknown[] = []) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState<string | undefined>(undefined);
  const [data, setData] = useState<T | undefined>(undefined);

  const updateQuery = async () => {
    setHasError(undefined);
    setIsLoading(true);
    try {
      const response = await query();
      setData(response);
    } catch (err) {
      /**
       * TODO - Make sure this is consistent from
       * API response
       */
      setHasError(`${err}`);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    updateQuery();
  }, [...dependencies]);

  useEffect(() => {
    const removeListener = window.api.onSyncProcessed(() => updateQuery());
    return () => removeListener();
  }, [query]);

  useEffect(() => {
    const removeListener = window.api.onGamesListUpdated(() => updateQuery());
    return () => removeListener();
  }, [query]);

  return { data, isLoading, hasError };
};
