import { CollectionStoreModel } from "@contracts/database/collections";
import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel, Library } from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/store/game";
import { Notification } from "@contracts/store/notification";
import { ElectronAPI } from "@electron-toolkit/preload";

import { RemoveListenerFunction } from "./util/listener-handler";

declare global {
  interface Window {
    api: {
      archiveGame: (id: string) => Promise<boolean>;
      authenticateIntegration: (library: Library, data?: unknown) => void;
      closeWindow: () => void;
      createCollection: (
        collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">,
      ) => Promise<CollectionStoreModel>;

      deleteCollection: (id: string) => Promise<boolean>;
      deleteGame: (id: string) => Promise<boolean>;
      getCollections: () => Promise<CollectionStoreModel[]>;
      getFilteredGames: (filters?: GameFilters) => Promise<GameListModel[]>;
      getGameById: (id: string) => Promise<GameStoreModel>;
      getGameFilters: () => Promise<{ [key in keyof GameStoreModel]?: { label: string; value: string }[] }>;
      getGamesList: () => Promise<GameListModel[]>;
      getNewGames: () => Promise<FeaturedGameModel[]>;
      getProtondbTier: (gameId: string) => Promise<string | null>;
      getQuickLaunchGames: () => Promise<GameListModel[]>;
      installGame: (id: string) => void;
      launchGame: (id: string) => void;
      maximizeWindow: () => void;
      minimizeWindow: () => void;
      onGamesListUpdated: (listener: (event) => void) => RemoveListenerFunction;
      onIntegrationAuthenticationResult: (
        listener: (event, { library: Library, success: boolean }) => void,
      ) => RemoveListenerFunction;
      onNotification: (listener: (event, data: Notification) => void) => RemoveListenerFunction;
      onSyncGameStatus: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      platform: string;
      restartApp: () => void;
      restartDevice: () => void;
      shutdownDevice: () => void;
      sleepDevice: () => void;
      syncGames: () => void;
      testLibraryIntegration: (library: Library) => Promise<boolean>;
      toggleFavouriteGame: (id: string) => Promise<GameStoreModel>;
      toggleQuickLaunchGame: (id: string) => Promise<GameStoreModel>;
      uninstallGame: (id: string) => void;
      updateCollection: (
        id: string,
        updates: Pick<CollectionStoreModel, "icon" | "name" | "filters">,
      ) => Promise<CollectionStoreModel>;
    };
    electron: ElectronAPI;
  }
}
