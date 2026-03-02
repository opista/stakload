import { ContextMenuProvider } from "@components/layout/context-menu";
import { ToastRenderer } from "@components/layout/desktop/notifications/toast-renderer";
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
    <div className="root">
      <ContextMenuProvider>
        <ToastRenderer />
        <Outlet />
      </ContextMenuProvider>
    </div>
  );
};
