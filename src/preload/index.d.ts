import { CollectionStoreModel } from "@contracts/database/collections";
import {
  FeaturedGameModel,
  GameFilters,
  GameListModel,
  GameStoreModel,
  LikeLibrary,
  Platform,
} from "@contracts/database/games";
import { GameSyncMessage } from "@contracts/store/game";
import { ElectronAPI } from "@electron-toolkit/preload";

import { RemoveListenerFunction } from "./util/listener-handler";

declare global {
  interface Window {
    api: {
      authenticateIntegration: (library: LikeLibrary) => void;
      clearSyncQueue: () => void;
      closeWindow: () => void;
      createCollection: (
        collection: Pick<CollectionStoreModel, "icon" | "name" | "filters">,
      ) => Promise<CollectionStoreModel>;
      decrypt: (str: string) => Promise<string>;
      deleteCollection: (id: string) => Promise<boolean>;
      encrypt: (str: string) => Promise<string>;
      fetch: <T>(...args: Parameters<typeof fetch>) => Promise<T>;
      getCollectionGames: (id: string) => Promise<GameListModel[]>;
      getCollections: () => Promise<CollectionStoreModel[]>;
      getFilteredGames: (filters?: GameFilters) => Promise<GameStoreModel[]>;
      getGameById: (id: string) => Promise<GameStoreModel>;
      getGameFilters: () => Promise<Record<string, { label: string; value: string }>>;
      getGamesLastSyncedAt: () => Promise<Date>;
      getGamesList: () => Promise<GameListModel[]>;
      getLocale: () => Promise<string>;
      getNewGames: () => Promise<FeaturedGameModel[]>;
      getOS: () => Promise<Platform>;
      getProtondbTier: (gameId: string) => Promise<string | null>;
      getQuickAccessGames: () => Promise<GameListModel[]>;
      maximizeWindow: () => void;
      minimizeWindow: () => void;
      onCollectionsUpdated: (listener: (event) => void) => RemoveListenerFunction;
      onEpicGamesAuthentication: (listener: (event, data: unknown) => void) => RemoveListenerFunction;
      onGamesListUpdated: (listener: (event) => void) => RemoveListenerFunction;
      onSyncComplete: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      onSyncInserted: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      onSyncProcessed: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      onSyncQueueCleared: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      onSyncSkipped: (listener: (event, data: GameSyncMessage) => void) => RemoveListenerFunction;
      removeGame: (id: string, preventReadd: boolean) => Promise<boolean>;
      restartApp: () => void;
      restartDevice: () => void;
      shutdownDevice: () => void;
      sleepDevice: () => void;
      syncGames: () => void;
      testLibraryIntegration: (steamid: string, webApiKey: string) => Promise<boolean>;
      toggleQuickAccessGame: (id: string) => Promise<GameStoreModel>;
      updateCollection: (
        id: string,
        updates: Pick<CollectionStoreModel, "name" | "filters">,
      ) => Promise<CollectionStoreModel>;
    };
    electron: ElectronAPI;
  }
}
