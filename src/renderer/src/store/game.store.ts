import { GameStoreModel } from "@contracts/database/games";
import { GameActions, GameState } from "@contracts/store/game";
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

type GameStore = GameState & GameActions;

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      gamesList: [],
      newGames: [],
      gamesDetails: {},
      gamesPreview: {},

      fetchGamesList: async () => {
        try {
          const games = await window.api.getGamesList();
          set({ gamesList: games });
        } catch (err) {
          console.log("action: fetchGamesList", err);
        }
      },

      fetchNewGames: async () => {
        try {
          const games = await window.api.getNewGames();
          console.log("new games", games);
          set({ newGames: games });
        } catch (err) {
          console.log("action: fetchNewGames", err);
        }
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
    }),
    {
      name: "game",
      storage: createConfStorage(conf),
    },
  ),
);
