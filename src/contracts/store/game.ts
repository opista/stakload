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
};

export type GameActions = {
  fetchCollectionGames: (id: string, { forceFetch }?: { forceFetch?: boolean }) => Promise<GameListModel[]>;
  fetchCollections: () => Promise<void>;
  fetchFilteredGames: (filters: GameFilters) => Promise<GameListModel[]>;
  fetchGameDetails: (id: string) => Promise<GameStoreModel>;
  fetchGamesList: () => Promise<void>;
  fetchNewGames: () => Promise<void>;
  fetchQuickLaunchGames: () => Promise<void>;
  invalidateCollectionCache: () => void;
  setQuickLaunchGameOrder: (ids: string[]) => void;
  toggleQuickLaunchGame: (id: string) => Promise<void>;
};
