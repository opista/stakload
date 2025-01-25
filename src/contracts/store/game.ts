import { CollectionStoreModel } from "@contracts/database/collections";
import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel } from "@contracts/database/games";

export type GameState = {
  collections: CollectionStoreModel[];
  collectionsCache: Record<string, GameListModel[]>;
  gamesDetails: Record<string, GameStoreModel>;
  gamesList: GameListModel[];
  newGames: FeaturedGameModel[];
  quickLaunchGames: GameListModel[];
  quickLaunchGamesOrder: string[];
  selectedCollection: string;
  selectedFilters: GameFilters;
};

export type GameActions = {
  fetchCollectionGames: (id: string) => Promise<GameListModel[]>;
  fetchCollections: () => Promise<void>;
  fetchFilteredGames: (filters: GameFilters) => Promise<GameListModel[]>;
  fetchGameDetails: (id: string) => Promise<GameStoreModel>;
  fetchGamesList: () => Promise<void>;
  fetchNewGames: () => Promise<void>;
  fetchQuickLaunchGames: () => Promise<void>;
  invalidateCollectionCache: () => void;
  resetFilters: () => void;
  setQuickLaunchGameOrder: (ids: string[]) => void;
  setSelectedCollection: (selectedCollection: string) => void;
  setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) => void;
  toggleQuickLaunchGame: (id: string) => Promise<void>;
};

export type GameSyncMessage = {
  processing: number;
  total: number;
};
