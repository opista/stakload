import { useGameStore } from "@store/game.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const GamesHandler = () => {
  const fetchGames = useGameStore(useShallow((state) => state.fetchGames));

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onSyncProcessed(() => fetchGames());
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onGamesListUpdated(() => fetchGames());
    return () => removeListener();
  }, []);

  return <></>;
};
