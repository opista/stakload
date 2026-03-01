import type { CollectionStoreModel, IpcApi } from "../ipc.types";

const noopRemoveListener = () => undefined;
const DEMO_COLLECTIONS_KEY = "stakload:demo:collections";

const readCollections = (): any[] => {
  const raw = localStorage.getItem(DEMO_COLLECTIONS_KEY);
  return raw ? JSON.parse(raw) : [];
};

const writeCollections = (collections: any[]): void => {
  localStorage.setItem(DEMO_COLLECTIONS_KEY, JSON.stringify(collections));
};

const createDemoIpc = (): IpcApi => ({
  collection: {
    createCollection: async (collection: CollectionStoreModel) => {
      const collections = readCollections();
      const nextCollection = {
        _id: crypto.randomUUID(),
        ...collection,
      };

      writeCollections([...collections, nextCollection]);

      return nextCollection as any;
    },
    deleteCollection: async (id: string) => {
      const collections = readCollections();
      writeCollections(collections.filter((collection) => collection._id !== id));
      return true;
    },
    getCollections: async () => {
      return readCollections() as any;
    },
    updateCollection: async (id: string, updates: Partial<CollectionStoreModel>) => {
      const collections = readCollections();
      const updatedCollection =
        collections.find((collection) => collection._id === id) ??
        ({
          _id: id,
          filters: {},
          name: "Demo Collection",
        } as any);

      Object.assign(updatedCollection, updates);
      writeCollections(collections.map((collection) => (collection._id === id ? updatedCollection : collection)));

      return updatedCollection;
    },
  },
  game: {
    archiveGameById: async () => null as any,
    deleteGameById: async () => false,
    getFilteredGames: async () => [],
    getGameById: async () => null as any,
    getGameFilters: async () => ({}),
    getGamesByCollection: async () => [],
    getGamesList: async () => [],
    getNewGames: async () => [],
    getProtondbTier: async () => null,
    getQuickLaunchGames: async () => [],
    installGame: () => undefined,
    launchGame: () => undefined,
    toggleFavouriteGame: async () => null as any,
    toggleQuickLaunchGame: async () => null as any,
    uninstallGame: () => undefined,
  },
  logging: {
    getLogsPath: async () => "",
    openLogsFolder: () => undefined,
    rendererLog: () => undefined,
  },
  sync: {
    authIntegration: async () => false,
    syncGames: () => undefined,
    testIntegration: async () => false,
  },
  system: {
    getPlatform: async () => "linux",
    restartApplication: () => undefined,
    restartDevice: () => undefined,
    shutdownDevice: () => undefined,
    sleepDevice: () => undefined,
  },
});

export const installDemoGlobals = (): void => {
  if (typeof window === "undefined" || window.ipc) {
    return;
  }

  window.ipc = createDemoIpc();
  window.api = {
    onGamesListUpdated: () => noopRemoveListener,
    onIntegrationAuthenticationResult: () => noopRemoveListener,
    onNotification: () => noopRemoveListener,
    onSyncGameStatus: () => noopRemoveListener,
    platform: "web",
  };
};
