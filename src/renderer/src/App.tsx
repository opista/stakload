import { ContextMenuProvider } from "@components/layout/ContextMenu";
import { ToastRenderer } from "@components/layout/Desktop/Notifications/ToastRenderer";
import { useGamesQuery } from "@hooks/use-games-query";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";
import { useEffect } from "react";
import { Outlet } from "react-router";
import { useShallow } from "zustand/react/shallow";

export const App = () => {
  const fetchCollections = useCollectionStore(useShallow((state) => state.fetchCollections));
  const refreshGameData = useGameStore(useShallow((state) => state.refreshGameData));
  const { syncOnStartup } = useIntegrationSettingsStore(
    useShallow((state) => ({
      syncOnStartup: state.syncOnStartup,
    })),
  );

  useGamesQuery(refreshGameData, []);

  if (syncOnStartup) {
    window.ipc.sync.syncGames();
  }

  useEffect(() => {
    void fetchCollections();
  }, []);

  return (
    <ContextMenuProvider>
      <ToastRenderer />
      <Outlet />
    </ContextMenuProvider>
  );
};
