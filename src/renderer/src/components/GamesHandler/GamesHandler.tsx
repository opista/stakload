import { useGameStore } from "@store/game.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const GamesHandler = () => {
  const { fetchGameFilters, fetchQuickLaunchGames, fetchGamesList, fetchNewGames } = useGameStore(
    useShallow((state) => ({
      fetchGameFilters: state.fetchGameFilters,
      fetchGamesList: state.fetchGamesList,
      fetchNewGames: state.fetchNewGames,
      fetchQuickLaunchGames: state.fetchQuickLaunchGames,
    })),
  );

  const triggerUpdates = () => {
    fetchQuickLaunchGames();
    fetchGamesList();
    fetchNewGames();
    fetchGameFilters();
  };

  useEffect(() => triggerUpdates(), []);

  useEffect(() => {
    const removeListener = window.api.onSyncGameStatus(() => triggerUpdates());
    return () => removeListener();
  }, []);

  useEffect(() => {
    const removeListener = window.api.onGamesListUpdated(() => triggerUpdates());
    return () => removeListener();
  }, []);

  return null;
};
