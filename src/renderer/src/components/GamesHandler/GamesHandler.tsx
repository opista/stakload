import { useGameStore } from "@store/game.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const GamesHandler = () => {
  const { fetchGamesList, fetchNewGames } = useGameStore(
    useShallow((state) => ({
      fetchGamesList: state.fetchGamesList,
      fetchNewGames: state.fetchNewGames,
    })),
  );

  const triggerUpdates = () => {
    fetchGamesList();
    fetchNewGames();
  };

  useEffect(() => triggerUpdates(), []);

  useEffect(() => {
    const removeListener = window.api.onSyncProcessed(() => triggerUpdates());
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onGamesListUpdated(() => triggerUpdates());
    return () => removeListener();
  }, []);

  return null;
};
