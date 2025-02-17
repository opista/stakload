import { CollectionStoreModel } from "@contracts/database/collections";
import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel } from "@contracts/database/games";

export type GameState = {
  collections: CollectionStoreModel[];
  collectionsCache: Record<string, GameListModel[]>;
  gameFilters: { [key in keyof GameStoreModel]?: { label: string; value: string }[] };
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
  fetchGameFilters: () => Promise<void>;
  fetchGamesList: () => Promise<void>;
  fetchNewGames: () => Promise<void>;
  fetchQuickLaunchGames: () => Promise<void>;
  invalidateCollectionCache: () => void;
  setQuickLaunchGameOrder: (ids: string[]) => void;
  toggleFavouriteGame: (id: string) => Promise<GameStoreModel>;
  toggleQuickLaunchGame: (id: string) => Promise<void>;
  updateCollection: (id: string, updates: Pick<CollectionStoreModel, "name" | "filters" | "icon">) => Promise<void>;
};
