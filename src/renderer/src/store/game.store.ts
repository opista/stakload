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
  collections: [],
  currentGame: undefined,
  fetchCollections: async () => {
    const collections = await window.api.getCollections();
    set({ collections });
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
  fetchGamesList: async () => {
    const games = await window.api.getGamesList();
    set({ gamesList: games });
  },
  fetchNewGames: async () => {
    const games = await window.api.getNewGames();
    set({ newGames: games });
  },
  gamesDetails: {},
  gamesList: [],
  gamesPreview: {},
  newGames: [],
  resetFilters: () => set({ selectedFilters: DEFAULT_FILTERS }),
  selectedCollection: "",
  selectedFilters: DEFAULT_FILTERS,
  selectedGame: null,

  setCurrentCollection: (id: string) => {
    const currentCollection = get().collections.find(({ _id }) => _id === id);
    set({ currentCollection });
  },

  setCurrentGame: (game: GameStoreModel) => set({ currentGame: game }),
  setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) =>
    set(() => ({
      selectedFilters: {
        ...DEFAULT_FILTERS,
        ...filters,
      },
    })),
  setSelectedCollection: (selectedCollection: string) => set({ selectedCollection }),
  setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) =>
    set((state) => ({
      selectedFilters: {
        ...state.selectedFilters,
        [key]: value,
      },
    })),
  setSelectedGame: (selectedGame: string | null) => set({ selectedGame }),
}));
