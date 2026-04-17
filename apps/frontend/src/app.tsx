import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { useShallow } from "zustand/react/shallow";

import { ContextMenuProvider } from "@components/layout/context-menu";
import { ToastRenderer } from "@components/layout/desktop/notifications/toast-renderer";
import { useGamesQuery } from "@hooks/use-games-query";
import { useCollectionStore } from "@store/collection.store";
import { useGameStore } from "@store/game.store";
import { useIntegrationSettingsStore } from "@store/integration-settings.store";

export const App = () => {
  const fetchCollections = useCollectionStore(useShallow((state) => state.fetchCollections));
  const refreshGameData = useGameStore(useShallow((state) => state.refreshGameData));
  const hasRequestedStartupSync = useRef(false);
  const { syncOnStartup } = useIntegrationSettingsStore(
    useShallow((state) => ({
      syncOnStartup: state.syncOnStartup,
    })),
  );

  useGamesQuery(refreshGameData, []);

  useEffect(() => {
    void fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    if (!syncOnStartup || hasRequestedStartupSync.current) return;
    hasRequestedStartupSync.current = true;
    window.ipc.sync.syncGames();
  }, [syncOnStartup]);

  return (
    <div className="root">
      <ContextMenuProvider>
        <ToastRenderer />
        <Outlet />
      </ContextMenuProvider>
    </div>
  );
};
