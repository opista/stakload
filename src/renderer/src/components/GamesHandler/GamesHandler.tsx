import { useGameStore } from "@store/game.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const GamesHandler = () => {
  const { fetchQuickAccessGames, fetchGamesList, fetchNewGames } = useGameStore(
    useShallow((state) => ({
      fetchGamesList: state.fetchGamesList,
      fetchNewGames: state.fetchNewGames,
      fetchQuickAccessGames: state.fetchQuickAccessGames,
    })),
  );

  const triggerUpdates = () => {
    fetchQuickAccessGames();
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
