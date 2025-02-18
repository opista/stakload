import { FeaturedGameModel, GameFilters, GameListModel, GameStoreModel } from "@contracts/database/games";

export type GameState = {
  gameFilters: { [key in keyof GameStoreModel]?: { label: string; value: string }[] };
  gamesDetails: Record<string, GameStoreModel>;
  gamesList: GameListModel[];
  newGames: FeaturedGameModel[];
  quickLaunchGames: GameListModel[];
  quickLaunchGamesOrder: string[];
};

export type GameActions = {
  archiveGame: (id: string) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  fetchFilteredGames: (filters: GameFilters) => Promise<GameListModel[]>;
  fetchGameDetails: (id: string) => Promise<GameStoreModel>;
  fetchGameFilters: () => Promise<void>;
  fetchGamesList: () => Promise<void>;
  fetchNewGames: () => Promise<void>;
  fetchQuickLaunchGames: () => Promise<void>;
  setQuickLaunchGameOrder: (ids: string[]) => void;
  toggleFavouriteGame: (id: string) => Promise<GameStoreModel>;
  toggleQuickLaunchGame: (id: string) => Promise<void>;
};
