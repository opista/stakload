import { GameStoreModel } from "@contracts/database/games";
import { GameState } from "@contracts/store/game";
import { createConfStorage } from "@util/create-conf-storage";
import { Conf } from "electron-conf/renderer";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const conf = new Conf();

const DEFAULT_FILTERS = {
  developers: undefined,
  gameModes: undefined,
  genres: undefined,
  playerPerspectives: undefined,
  publishers: undefined,
};

type GameActions = {
  fetchCollections: () => void;
  fetchGames: () => void;
  resetFilters: () => void;
  setCurrentCollection: (id: string) => void;
  setCurrentGame: (game: GameStoreModel) => void;
  setMultipleFilters: (filters: Partial<GameState["selectedFilters"]>) => void;
  setSelectedCollection: (selectedCollection: string) => void;
  setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) => void;
};

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      games: [],
      currentGame: undefined,
      fetchGames: async () => {
        const games = await window.api.getFilteredGames();
        set({ games });
      },
      setCurrentGame: (currentGame: GameStoreModel) => set(() => ({ currentGame })),

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
      setSelectedCollection: (selectedCollection: string) => set({ selectedCollection }),
      setSelectedGame: (selectedGame: string | null) => set({ selectedGame }),
      setSelectedFilter: (key: keyof GameState["selectedFilters"], value: string[]) =>
        set((state) => ({
          selectedFilters: {
            ...state.selectedFilters,
            [key]: value,
          },
        })),
    }),
    {
      name: "game",
      storage: createConfStorage(conf),
    },
  ),
);
