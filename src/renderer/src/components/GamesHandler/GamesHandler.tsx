import { useGameStore } from "@store/game.store";
import { useEffect } from "react";
import { useShallow } from "zustand/react/shallow";

export const GamesHandler = () => {
  const { fetchQuickLaunchGames, fetchGamesList, fetchNewGames } = useGameStore(
    useShallow((state) => ({
      fetchGamesList: state.fetchGamesList,
      fetchNewGames: state.fetchNewGames,
      fetchQuickLaunchGames: state.fetchQuickLaunchGames,
    })),
  );

  const triggerUpdates = () => {
    fetchQuickLaunchGames();
    fetchGamesList();
    fetchNewGames();
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
