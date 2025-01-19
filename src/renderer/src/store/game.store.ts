import { GameStoreModel } from "@contracts/database/games";
import { GameActions, GameState } from "@contracts/store/game";
import { create } from "zustand";

const DEFAULT_FILTERS = {
  ageRatings: undefined,
  developers: undefined,
  gameModes: undefined,
  genres: undefined,
  libraries: undefined,
  platforms: undefined,
  playerPerspectives: undefined,
  publishers: undefined,
};

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()((set, get) => ({
  gamesList: [],
  newGames: [],
  gamesDetails: {},
  gamesPreview: {},

  fetchGamesList: async () => {
    const games = await window.api.getGamesList();
    set({ gamesList: games });
  },

  fetchNewGames: async () => {
    const games = await window.api.getNewGames();
    set({ newGames: games });
  },

  fetchGameDetails: async (id: string) => {
    const details = await window.api.getGameById(id);
    set((state) => ({
      gamesDetails: {
        ...state.gamesDetails,
        [id]: details,
      },
    }));
  },

  currentGame: undefined,
  collections: [],
  fetchCollections: async () => {
    const collections = await window.api.getCollections();
    set({ collections });
  },
  setCurrentCollection: (id: string) => {
    const currentCollection = get().collections.find(({ _id }) => _id === id);
    set({ currentCollection });
  },
  selectedCollection: "",
  selectedGame: null,
  selectedFilters: DEFAULT_FILTERS,
  resetFilters: () => set({ selectedFilters: DEFAULT_FILTERS }),
  setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) =>
    set(() => ({
      selectedFilters: {
        ...DEFAULT_FILTERS,
        ...filters,
      },
    })),
  setCurrentGame: (game: GameStoreModel) => set({ currentGame: game }),
  setSelectedCollection: (selectedCollection: string) => set({ selectedCollection }),
  setSelectedGame: (selectedGame: string | null) => set({ selectedGame }),
  setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [key]: value,
      },
    })),
}));
