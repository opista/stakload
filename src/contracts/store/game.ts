import { CollectionStoreModel } from "@contracts/database/collections";
import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel } from "@contracts/database/games";

export type GameState = {
  collections: CollectionStoreModel[];
  currentCollection?: CollectionStoreModel;
  currentGame?: GameStoreModel;
  gamesDetails: Record<string, GameStoreModel>;
  gamesList: GameListModel[];
  newGames: FeaturedGameModel[];
  selectedCollection: string;
  selectedFilters: GameFilters;
  selectedGame: string | null;
};

export type GameActions = {
  fetchCollections: () => Promise<void>;
  fetchGameDetails: (id: string) => Promise<void>;
  fetchGamesList: () => Promise<void>;
  fetchNewGames: () => Promise<void>;
  resetFilters: () => void;
  setCurrentCollection: (id: string) => void;
  setCurrentGame: (game: GameStoreModel) => void;
  setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) => void;
  setSelectedCollection: (selectedCollection: string) => void;
  setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) => void;
  setSelectedGame: (selectedGame: string | null) => void;
};

export type GameSyncMessage = {
  processing: number;
  total: number;
};
