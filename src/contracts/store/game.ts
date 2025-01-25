import { CollectionStoreModel } from "@contracts/database/collections";
import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel } from "@contracts/database/games";

export type GameState = {
  collections: CollectionStoreModel[];
  currentCollection?: CollectionStoreModel;
  gamesDetails: Record<string, GameStoreModel>;
  gamesList: GameListModel[];
  newGames: FeaturedGameModel[];
  quickLaunchGames: GameListModel[];
  quickLaunchGamesOrder: string[];
  selectedCollection: string;
  selectedFilters: GameFilters;
  selectedGame: string | null;
};

export type GameActions = {
  fetchCollections: () => Promise<void>;
  fetchGameDetails: (id: string) => Promise<GameStoreModel>;
  fetchGamesList: () => Promise<void>;
  fetchNewGames: () => Promise<void>;
  fetchQuickLaunchGames: () => Promise<void>;
  resetFilters: () => void;
  setCurrentCollection: (id: string) => void;
  setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) => void;
  setQuickLaunchGameOrder: (ids: string[]) => void;
  setSelectedCollection: (selectedCollection: string) => void;
  setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) => void;
  setSelectedGame: (selectedGame: string | null) => void;
  toggleQuickLaunchGame: (id: string) => Promise<void>;
};

export type GameSyncMessage = {
  processing: number;
  total: number;
};
